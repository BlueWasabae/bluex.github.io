import * as React from "react"
import JournalCalendarDemo from "@/components/ui/demo"

export const metadata = {
  title: "BlueX Institutional Trading Journal | Pure S&D Audit",
  description: "Mechanical trading journal and position lifecycle calendar for XAU/USD execution."
}

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-900/60 backdrop-blur">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-amber-400">⚡ BlueX</span> Institutional Trading Journal
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Pure Institutional S&D Framework (DBR / RBD) • Mechanical Liquidity Auditing
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            MT5 Bridge: Connected
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Asset: XAU/USD
          </span>
        </div>
      </header>

      <div className="flex-1 p-4 lg:p-6">
        <JournalCalendarDemo />
      </div>
    </main>
  )
}
