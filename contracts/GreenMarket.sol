// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title GreenMarket
/// @notice AI-settled 1v1 claim market on Monad. Stake is native MON.
///         Two parties lock matching MON stakes on opposite sides of a claim.
///         After the resolve window opens, a designated oracle reads the
///         agreed evidence source off-chain and posts the verdict on-chain.
///         Winner takes the full pot minus a 2% protocol fee.
contract GreenMarket {
    enum Status { Open, Accepted, Resolved, Cancelled, Expired }

    struct Challenge {
        address creator;
        address opponent;      // zero address = open to anyone
        address acceptedBy;
        uint256 stake;         // per side, in wei (MON)
        string claim;          // the statement being staked on
        string evidenceSource; // agreed source the oracle will read
        uint256 acceptDeadline;  // must be accepted before this timestamp
        uint256 resolveDeadline; // verdict cannot be posted before this timestamp
        Status status;
        address winner;
        string verdictReason;
    }

    address public owner;
    address public oracle;
    address public feeRecipient;

    uint256 public constant MIN_STAKE = 0.01 ether; // MON uses 18 decimals
    uint256 public constant FEE_BPS = 200; // 2% fee in basis points

    uint256 public challengeCount;
    uint256 public totalStaked;
    uint256 public totalChallenges;
    uint256 public verdictsRecorded;
    uint256 public feesCollected;

    mapping(uint256 => Challenge) public challenges;

    event ChallengeCreated(
        uint256 indexed id,
        address indexed creator,
        address opponent,
        uint256 stake,
        string claim,
        string evidenceSource,
        uint256 acceptDeadline,
        uint256 resolveDeadline
    );
    event ChallengeAccepted(uint256 indexed id, address indexed acceptor);
    event ChallengeCancelled(uint256 indexed id);
    event ChallengeExpired(uint256 indexed id);
    event ChallengeResolved(uint256 indexed id, address indexed winner, string reason);
    event OracleUpdated(address indexed newOracle);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle, "not oracle");
        _;
    }

    constructor(address _oracle) {
        owner = msg.sender;
        feeRecipient = msg.sender;
        oracle = _oracle == address(0) ? msg.sender : _oracle;
    }

    function setOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "zero address");
        oracle = _oracle;
        emit OracleUpdated(_oracle);
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "zero address");
        feeRecipient = _feeRecipient;
    }

    /// @notice Create a challenge and lock your stake in MON.
    function createChallenge(
        address _opponent,
        string calldata _claim,
        string calldata _evidenceSource,
        uint256 _acceptWindow,
        uint256 _resolveWindow
    ) external payable returns (uint256 id) {
        require(msg.value >= MIN_STAKE, "minimum stake is 0.01 MON");
        require(_acceptWindow > 0, "accept window required");
        require(_resolveWindow > _acceptWindow, "resolve must be after accept window");
        require(bytes(_claim).length > 0, "claim required");

        id = challengeCount++;
        Challenge storage c = challenges[id];
        c.creator = msg.sender;
        c.opponent = _opponent;
        c.stake = msg.value;
        c.claim = _claim;
        c.evidenceSource = _evidenceSource;
        c.acceptDeadline = block.timestamp + _acceptWindow;
        c.resolveDeadline = block.timestamp + _resolveWindow;
        c.status = Status.Open;

        totalStaked += msg.value;
        totalChallenges += 1;

        emit ChallengeCreated(
            id, msg.sender, _opponent, msg.value, _claim, _evidenceSource, c.acceptDeadline, c.resolveDeadline
        );
    }

    /// @notice Accept an open challenge by matching its stake exactly.
    function acceptChallenge(uint256 _id) external payable {
        Challenge storage c = challenges[_id];
        require(c.status == Status.Open, "not open");
        require(block.timestamp <= c.acceptDeadline, "accept window closed");
        require(msg.value == c.stake, "must match stake");
        require(msg.sender != c.creator, "cannot accept own challenge");
        if (c.opponent != address(0)) {
            require(msg.sender == c.opponent, "not the invited rival");
        }

        c.acceptedBy = msg.sender;
        c.status = Status.Accepted;
        totalStaked += msg.value;

        emit ChallengeAccepted(_id, msg.sender);
    }

    /// @notice Creator can cancel and get refunded if nobody has accepted yet.
    function cancelChallenge(uint256 _id) external {
        Challenge storage c = challenges[_id];
        require(c.status == Status.Open, "not open");
        require(msg.sender == c.creator, "not creator");

        c.status = Status.Cancelled;
        totalStaked -= c.stake;

        (bool sent, ) = c.creator.call{value: c.stake}("");
        require(sent, "refund failed");

        emit ChallengeCancelled(_id);
    }

    /// @notice Anyone can trigger a refund once the accept window has lapsed unaccepted.
    function claimExpired(uint256 _id) external {
        Challenge storage c = challenges[_id];
        require(c.status == Status.Open, "not open");
        require(block.timestamp > c.acceptDeadline, "not expired yet");

        c.status = Status.Expired;
        totalStaked -= c.stake;

        (bool sent, ) = c.creator.call{value: c.stake}("");
        require(sent, "refund failed");

        emit ChallengeExpired(_id);
    }

    /// @notice Oracle posts the verdict. Winner takes the pot minus 2% fee.
    function resolveChallenge(uint256 _id, address _winner, string calldata _reason) external onlyOracle {
        Challenge storage c = challenges[_id];
        require(c.status == Status.Accepted, "not accepted");
        require(block.timestamp >= c.resolveDeadline, "too early to resolve");
        require(_winner == c.creator || _winner == c.acceptedBy, "invalid winner");

        c.status = Status.Resolved;
        c.winner = _winner;
        c.verdictReason = _reason;

        uint256 pot = c.stake * 2;
        uint256 fee = (pot * FEE_BPS) / 10000;
        uint256 payout = pot - fee;

        totalStaked -= pot;
        feesCollected += fee;
        verdictsRecorded += 1;

        (bool winnerPaid, ) = _winner.call{value: payout}("");
        require(winnerPaid, "payout failed");

        if (fee > 0) {
            (bool feePaid, ) = feeRecipient.call{value: fee}("");
            require(feePaid, "fee transfer failed");
        }

        emit ChallengeResolved(_id, _winner, _reason);
    }

    function getChallenge(uint256 _id) external view returns (Challenge memory) {
        return challenges[_id];
    }

    function vaultBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
