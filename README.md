# GreenMarket

AI-settled 1v1 prediction challenges on Monad. Stake MON. No referees. No arguments.

Built for the [BuildAnything Spark Hackathon](https://buildanything.so/hackathons/spark).

---

## How it works

1. **Challenge** — Define a claim, lock MON in the vault
2. **Invite** — Share your challenge link or call out a specific rival
3. **Accept** — Rival matches the stake, contract activates
4. **Verdict** — AI oracle reads the agreed evidence source and pays the winner on-chain

---

## Stack

- **Frontend** — Next.js 15, Tailwind CSS, wagmi v2, RainbowKit
- **Smart Contract** — Solidity 0.8.19 on Monad Testnet
- **AI Oracle** — OpenRouter (`qwen/qwen3-coder`, fallback `openai/gpt-oss-120b`)
- **Chain** — Monad Testnet (Chain ID 10143)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Address of deployed GreenMarket contract |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | From cloud.walletconnect.com |
| `OPENROUTER_API_KEY` | From openrouter.ai/keys |
| `ORACLE_PRIVATE_KEY` | Private key of your oracle wallet |
| `ORACLE_API_SECRET` | Random secret to protect the oracle endpoint |

### 3. Deploy the contract

Deploy `contracts/GreenMarket.sol` to Monad Testnet (Chain ID 10143, RPC: https://testnet-rpc.monad.xyz).
Pass your oracle wallet address as the constructor argument.
Get testnet MON from https://faucet.monad.xyz

### 4. Run locally

```bash
npm run dev
```

### 5. Settle a challenge (Oracle)

```bash
curl -X POST http://localhost:3000/api/oracle \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ORACLE_API_SECRET" \
  -d '{"challengeId": 0}'
```

---

## Contract: Key functions

| Function | Who | Description |
|---|---|---|
| `createChallenge()` | Anyone | Lock stake, define claim |
| `acceptChallenge()` | Rival | Match stake, activate challenge |
| `cancelChallenge()` | Creator | Refund if unaccepted |
| `claimExpired()` | Anyone | Refund creator after accept window |
| `resolveChallenge()` | Oracle | Post verdict, pay winner (98% of pot) |

---

## License

MIT
