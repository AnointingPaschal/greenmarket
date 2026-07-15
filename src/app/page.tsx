import Link from "next/link";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { StatsBar } from "@/components/ui/StatsBar";

export default function HomePage() {
  const steps = [
    {
      num: "01",
      title: "CHALLENGE",
      desc: "Define your claim, set your stake in MON, and lock it in the vault. The AI is watching.",
    },
    {
      num: "02",
      title: "INVITE",
      desc: "Share your challenge link. Call out a specific rival or open it to the public arena.",
    },
    {
      num: "03",
      title: "ACCEPT",
      desc: "Your rival matches the stake. The smart contract activates and locks the full pot.",
    },
    {
      num: "04",
      title: "VERDICT",
      desc: "The AI reads the agreed evidence source and settles on-chain. Winner takes the pot.",
    },
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "AI-Settled",
      desc: "No referees, no appeals. The oracle reads the agreed evidence and posts the verdict on-chain.",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Non-Custodial",
      desc: "Funds are locked in the smart contract. Nobody can touch them until the verdict is in.",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Time-Locked",
      desc: "Set your own accept and resolve windows. Full control over the challenge timeline.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-28 sm:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(34,197,94,0.08),transparent)]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-8 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live on Monad Testnet
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-6">
            DON&apos;T ARGUE.
            <br />
            <span className="text-emerald-400">SETTLE.</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Stand behind your claim. Stake MON. The AI reads the evidence and pays the winner on-chain.
            No referees. No arguments.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/create"
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-sm hover:bg-emerald-400 transition-colors text-sm"
            >
              Create a Challenge <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/explorer"
              className="flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 font-medium rounded-sm hover:border-zinc-500 hover:text-white transition-colors text-sm"
            >
              Browse Challenges
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <StatsBar />
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-800">
        <div className="mb-12 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono mb-3">The Protocol</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">How it works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800">
          {steps.map((s) => (
            <div key={s.num} className="bg-zinc-950 p-8">
              <div className="font-mono text-emerald-400 text-xs font-bold mb-4 tracking-widest">{s.num}</div>
              <h3 className="font-black text-lg tracking-tight mb-3">{s.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-sm border border-zinc-700 flex items-center justify-center text-emerald-400">
                {f.icon}
              </div>
              <h3 className="font-bold text-base">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">
            READY TO WIN?
          </h2>
          <p className="text-zinc-400 mb-8 text-lg max-w-md mx-auto">
            Set the terms, lock your stake, and share the link. When the outcome is provable, GreenMarket settles it.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-black font-bold rounded-sm hover:bg-emerald-400 transition-colors"
          >
            Create a Challenge <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-2">
          <span className="font-bold text-zinc-500">GreenMarket</span>
          <span>AI-settled claim markets on Monad. No referees. No arguments.</span>
        </div>
      </footer>
    </div>
  );
}
