"use client"

import * as React from "react"
import { 
  ArrowUpRight, 
  BarChart3, 
  CheckCircle2, 
  DollarSign, 
  Flame, 
  HelpCircle, 
  Layers, 
  LogOut, 
  Plus, 
  Search, 
  Shield, 
  Sliders, 
  TrendingUp, 
  Zap 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface SalesDashboardProps {
  username?: string
}

export function SalesDashboard({ username = "bluewasabae" }: SalesDashboardProps) {
  const [riskPct, setRiskPct] = React.useState<number>(0.5)
  const [targetRR, setTargetRR] = React.useState<number>(3.0)
  const [execMode, setExecMode] = React.useState<"AUTO" | "MANUAL">("MANUAL")

  return (
    <div className="flex min-h-screen bg-[#060911] text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-black">
      
      {/* Sidebar (AdminCN Navigation) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800/80 bg-[#090d18] flex-shrink-0">
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-amber-400 to-amber-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center font-black text-amber-400 text-xs">
              BX
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white">BlueX AdminCN</h2>
            <p className="text-[10px] font-mono text-slate-400">Quantitative Desk</p>
          </div>
        </div>

        <div className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
          <div>
            <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Dashboards
            </span>
            <div className="mt-2 space-y-1">
              <a href="/dashboard/sales" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Sales & Execution</span>
                <span className="ml-auto text-[9px] font-mono bg-amber-500/20 px-1.5 py-0.2 rounded font-bold">LIVE</span>
              </a>
              <a href="/journal" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 text-xs font-medium transition">
                <Layers className="w-4 h-4" />
                <span>Trading Journal</span>
              </a>
            </div>
          </div>

          <div>
            <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Execution Terminal
            </span>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Signal Queue</span>
                <span className="ml-auto px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">0</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>MT5 Open Orders</span>
                <span className="ml-auto px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-slate-800/80 bg-[#080b14]/80">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-amber-400 flex items-center justify-center font-bold text-black text-xs">
              BW
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs font-bold text-white truncate">{username}</div>
              <div className="text-[10px] text-slate-400 truncate font-mono">Lead Operator</div>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-400">
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 px-6 bg-[#090d18]/90 backdrop-blur border-b border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Dashboard</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold">Sales & Execution</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-full px-3.5 py-1 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300 font-bold">MT5: #115076007</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-bold">XAU/USD: 2715.50</span>
            </div>

            <Button variant="outline" size="sm" className="h-8 gap-2 border-slate-700 bg-slate-900 text-xs">
              <span className="text-amber-400">⚡</span>
              <span>Operator: {username}</span>
            </Button>
          </div>
        </header>

        {/* Dashboard Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Sales & Quantitative Execution</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Real-time institutional liquidity sweeps, automated S&D limit orders, and multi-account MT5 management.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs font-mono border-slate-800 bg-slate-900">
                Nov 1, 2026 - Nov 30, 2026
              </Button>
              <Button size="sm" className="h-8 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black">
                + Simulate S&D Setup
              </Button>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0c101d] border border-slate-800/80 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase font-mono">Total Net PnL (Sales)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">+$48,250.00</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+20.1% vs last month payout</span>
              </div>
            </div>

            <div className="bg-[#0c101d] border border-slate-800/80 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase font-mono">Volume / Turnover</span>
                <BarChart3 className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black font-mono text-white tracking-tight">2,840.5 Lots</div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12.4% institutional flow</span>
              </div>
            </div>

            <div className="bg-[#0c101d] border border-slate-800/80 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase font-mono">Active MT5 Bridge</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black font-mono text-amber-400 tracking-tight">0 Open / 0 Pending</div>
              <div className="mt-2 text-xs font-mono text-slate-400">
                Equity: <b className="text-white">$100,000.93</b>
              </div>
            </div>

            <div className="bg-[#0c101d] border border-slate-800/80 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase font-mono">Win Rate (PF: 2.84)</span>
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black font-mono text-purple-400 tracking-tight">73.8%</div>
              <div className="mt-2 text-xs font-mono text-slate-500">
                Pure S&D discipline
              </div>
            </div>
          </div>

          {/* Execution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#0c101d] border border-slate-800/80 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Execution & Sales Overview</h3>
              <p className="text-xs text-slate-400 font-mono">Daily realized returns and target RR fulfillment on XAU/USD.</p>
              
              <div className="h-56 flex items-end gap-3 pt-6 border-b border-slate-800/80 font-mono text-xs text-slate-500">
                <div className="flex-1 bg-slate-800 hover:bg-amber-400 rounded-t transition" style={{ height: "45%" }}></div>
                <div className="flex-1 bg-slate-800 hover:bg-amber-400 rounded-t transition" style={{ height: "65%" }}></div>
                <div className="flex-1 bg-slate-800 hover:bg-amber-400 rounded-t transition" style={{ height: "35%" }}></div>
                <div className="flex-1 bg-slate-800 hover:bg-amber-400 rounded-t transition" style={{ height: "80%" }}></div>
                <div className="flex-1 bg-slate-800 hover:bg-amber-400 rounded-t transition" style={{ height: "55%" }}></div>
                <div className="flex-1 bg-amber-500 hover:bg-amber-400 rounded-t shadow-md shadow-amber-500/20" style={{ height: "92%" }}></div>
              </div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Avg Daily Return: <b className="text-emerald-400">+$2,410.00</b></span>
                <span>Target RR: <b className="text-amber-400">1:3.0</b></span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0c101d] border border-slate-800/80 rounded-xl p-5 shadow-xl space-y-3">
              <h3 className="text-base font-bold text-white">Recent Executed Sales</h3>
              <p className="text-xs text-slate-400 font-mono">24 institutional trade executions this month.</p>

              <div className="space-y-3 font-mono text-xs pt-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080b14] border border-slate-800">
                  <div>
                    <div className="font-bold text-emerald-400">XAU/USD Buy Limit</div>
                    <div className="text-[10px] text-slate-400">DBR Base @ 2712.50 • 1.25 Lots</div>
                  </div>
                  <div className="text-right font-bold text-emerald-400">+$640.00</div>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080b14] border border-slate-800">
                  <div>
                    <div className="font-bold text-rose-400">XAU/USD Sell Limit</div>
                    <div className="text-[10px] text-slate-400">RBD Base @ 2735.80 • 1.50 Lots</div>
                  </div>
                  <div className="text-right font-bold text-emerald-400">+$820.00</div>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#080b14] border border-slate-800">
                  <div>
                    <div className="font-bold text-cyan-400">XAU/USD Breakeven</div>
                    <div className="text-[10px] text-slate-400">Protected Entry (+0.40 Buffer)</div>
                  </div>
                  <div className="text-right font-bold text-cyan-400">+$40.00</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SalesDashboard
