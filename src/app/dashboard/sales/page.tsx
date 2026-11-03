import * as React from "react"
import SalesDashboard from "@/components/dashboard/sales-dashboard"

export const metadata = {
  title: "Sales & Quantitative Execution • BlueX AdminCN",
  description: "Institutional trade execution, MT5 bridge, and position sales analytics."
}

export default function SalesPage() {
  return <SalesDashboard username="bluewasabae" />
}
