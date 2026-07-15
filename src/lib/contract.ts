export const GREENMARKET_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_oracle", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "acceptor", "type": "address" }
    ],
    "name": "ChallengeAccepted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "ChallengeCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "opponent", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "stake", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "claim", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "evidenceSource", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "acceptDeadline", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "resolveDeadline", "type": "uint256" }
    ],
    "name": "ChallengeCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "ChallengeExpired",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "reason", "type": "string" }
    ],
    "name": "ChallengeResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{ "indexed": true, "internalType": "address", "name": "newOracle", "type": "address" }],
    "name": "OracleUpdated",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "acceptChallenge",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "cancelChallenge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "claimExpired",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "challengeCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_opponent", "type": "address" },
      { "internalType": "string", "name": "_claim", "type": "string" },
      { "internalType": "string", "name": "_evidenceSource", "type": "string" },
      { "internalType": "uint256", "name": "_acceptWindow", "type": "uint256" },
      { "internalType": "uint256", "name": "_resolveWindow", "type": "uint256" }
    ],
    "name": "createChallenge",
    "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getChallenge",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "address", "name": "opponent", "type": "address" },
          { "internalType": "address", "name": "acceptedBy", "type": "address" },
          { "internalType": "uint256", "name": "stake", "type": "uint256" },
          { "internalType": "string", "name": "claim", "type": "string" },
          { "internalType": "string", "name": "evidenceSource", "type": "string" },
          { "internalType": "uint256", "name": "acceptDeadline", "type": "uint256" },
          { "internalType": "uint256", "name": "resolveDeadline", "type": "uint256" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "address", "name": "winner", "type": "address" },
          { "internalType": "string", "name": "verdictReason", "type": "string" }
        ],
        "internalType": "struct GreenMarket.Challenge",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalStaked",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalChallenges",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "verdictsRecorded",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vaultBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oracle",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_oracle", "type": "address" }],
    "name": "setOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "address", "name": "_winner", "type": "address" },
      { "internalType": "string", "name": "_reason", "type": "string" }
    ],
    "name": "resolveChallenge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Update this after deploying the contract
export const GREENMARKET_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const MONAD_TESTNET = {
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "MON",
    symbol: "MON",
  },
  rpcUrls: {
    public: { http: ["https://testnet-rpc.monad.xyz"] },
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadexplorer.com" },
  },
  testnet: true,
} as const;

export const STATUS_MAP: Record<number, string> = {
  0: "Open",
  1: "Accepted",
  2: "Resolved",
  3: "Cancelled",
  4: "Expired",
};

export const STATUS_COLOR: Record<number, string> = {
  0: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  1: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  2: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  3: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  4: "text-red-400 bg-red-400/10 border-red-400/20",
};
