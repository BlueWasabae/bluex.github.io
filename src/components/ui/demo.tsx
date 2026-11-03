"use client"

import * as React from "react"
import { FullScreenCalendar, CalendarData } from "@/components/ui/fullscreen-calendar"
import { subDays, addDays, startOfToday } from "date-fns"

const today = startOfToday()

const institutionalTradeData: CalendarData[] = [
  {
    day: subDays(today, 3),
    events: [
      {
        id: 1,
        name: "XAUUSD Buy Limit (DBR Base @ 2712.50) - 1:3.2 RR [+640 USD]",
        time: "08:15 AM",
        datetime: "2026-11-01T08:15:00",
      },
    ],
  },
  {
    day: subDays(today, 2),
    events: [
      {
        id: 2,
        name: "XAUUSD Sell Limit (SSL Sweep + RBD @ 2735.80) - 1:3.0 RR [+820 USD]",
        time: "01:30 PM",
        datetime: "2026-11-02T13:30:00",
      },
      {
        id: 3,
        name: "XAUUSD BE Trigger (+0.40 spread lock @ 2724.00)",
        time: "04:45 PM",
        datetime: "2026-11-02T16:45:00",
      },
    ],
  },
  {
    day: subDays(today, 1),
    events: [
      {
        id: 4,
        name: "XAUUSD Buy Limit (H1 Demand DBR @ 2720.00) - Invalidation Hit [-250 USD]",
        time: "10:00 AM",
        datetime: "2026-11-03T10:00:00",
      },
    ],
  },
  {
    day: today,
    events: [
      {
        id: 5,
        name: "XAUUSD Live Pending: Buy Limit (M15 DBR @ 2718.50, SL: 2714.50, TP: 2730.50)",
        time: "09:30 AM",
        datetime: "2026-11-04T09:30:00",
      },
      {
        id: 6,
        name: "Daily Journal Audit: 0.50% Risk Allocation | Win Rate: 72%",
        time: "05:00 PM",
        datetime: "2026-11-04T17:00:00",
      },
    ],
  },
  {
    day: addDays(today, 1),
    events: [
      {
        id: 7,
        name: "Macro Liquidity Sweep Watch (BSL 2745.00 / SSL 2710.00)",
        time: "02:00 PM",
        datetime: "2026-11-05T14:00:00",
      },
    ],
  },
]

export default function JournalCalendarDemo() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground p-4">
      <FullScreenCalendar data={institutionalTradeData} />
    </div>
  )
}
