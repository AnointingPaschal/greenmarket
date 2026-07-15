import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { MONAD_TESTNET, GREENMARKET_ABI, GREENMARKET_ADDRESS } from "@/lib/contract";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const MODELS = ["qwen/qwen3-coder", "openai/gpt-oss-120b"];

async function callOpenRouter(prompt: string): Promise<string> {
  for (const model of MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://greenmarket.vercel.app",
          "X-Title": "GreenMarket Oracle",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: `You are GreenMarket's impartial AI oracle. You settle 1v1 prediction challenges based on verifiable evidence.

Your job:
1. Read the claim, the evidence source, and any fetched evidence data
2. Determine who wins based only on the evidence
3. Output ONLY valid JSON: {"winner": "creator" | "opponent", "reason": "<1-2 sentence explanation citing the evidence>"}

Rules:
- Be strictly objective. Do not speculate or use outside knowledge beyond what is provided
- If evidence is ambiguous, say so in the reason and pick the most defensible answer
- The reason must cite what specific evidence you used`,
            },
            { role: "user", content: prompt },
          ],
          temperature: 0,
          max_tokens: 300,
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) continue;
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch {
      continue;
    }
  }
  throw new Error("All models failed");
}

async function fetchEvidence(source: string): Promise<string> {
  if (!source.startsWith("http")) return "";
  try {
    const res = await fetch(source, {
      headers: { "User-Agent": "GreenMarket-Oracle/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    const text = await res.text();
    return text.slice(0, 2000);
  } catch {
    return "";
  }
}

// POST — get AI verdict. The caller's wallet submits the tx on-chain.
export async function POST(req: NextRequest) {
  try {
    const { challengeId } = await req.json();
    if (challengeId === undefined) {
      return NextResponse.json({ error: "challengeId required" }, { status: 400 });
    }

    const publicClient = createPublicClient({
      chain: MONAD_TESTNET,
      transport: http(),
    });

    const challenge = await publicClient.readContract({
      address: GREENMARKET_ADDRESS,
      abi: GREENMARKET_ABI,
      functionName: "getChallenge",
      args: [BigInt(challengeId)],
    }) as any;

    if (challenge.status !== 1) {
      return NextResponse.json({ error: "Challenge not in Accepted state" }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);
    if (now < Number(challenge.resolveDeadline)) {
      return NextResponse.json(
        {
          error: `Too early. Resolve window opens at ${new Date(
            Number(challenge.resolveDeadline) * 1000
          ).toISOString()}`,
        },
        { status: 400 }
      );
    }

    const evidenceData = await fetchEvidence(challenge.evidenceSource);

    const prompt = `Challenge #${challengeId}

CLAIM: "${challenge.claim}"

EVIDENCE SOURCE: ${challenge.evidenceSource}

${evidenceData ? `FETCHED EVIDENCE DATA:\n${evidenceData}` : "(Evidence source could not be auto-fetched — rule based on the source description alone)"}

PARTIES:
- Creator address: ${challenge.creator}
- Opponent address: ${challenge.acceptedBy}

Based on the claim and evidence, who wins? Reply with JSON only.`;

    const aiResponse = await callOpenRouter(prompt);
    const verdict = JSON.parse(aiResponse);

    if (!verdict.winner || !verdict.reason) {
      return NextResponse.json({ error: "Invalid AI response", raw: aiResponse }, { status: 500 });
    }

    // Map "creator"/"opponent" to actual address
    const winnerAddress: string =
      verdict.winner === "creator" ? challenge.creator : challenge.acceptedBy;

    // Return the verdict — the frontend wallet submits resolveChallenge() directly
    return NextResponse.json({
      challengeId,
      winner: winnerAddress,
      reason: verdict.reason,
      model: MODELS[0],
    });
  } catch (err: any) {
    console.error("[oracle]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET — check if challenge is ready to resolve
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    const publicClient = createPublicClient({
      chain: MONAD_TESTNET,
      transport: http(),
    });

    const challenge = await publicClient.readContract({
      address: GREENMARKET_ADDRESS,
      abi: GREENMARKET_ABI,
      functionName: "getChallenge",
      args: [BigInt(id)],
    }) as any;

    const now = Math.floor(Date.now() / 1000);
    const readyToResolve = challenge.status === 1 && now >= Number(challenge.resolveDeadline);

    return NextResponse.json({
      id,
      status: challenge.status,
      readyToResolve,
      resolveDeadline: new Date(Number(challenge.resolveDeadline) * 1000).toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
