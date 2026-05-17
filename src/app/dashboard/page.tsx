"use client"

import { Dashboard } from "@/components/dashboard/components";
import { DashboardProvider } from "@/components/dashboard/lib/dashboard-store";

export default function Page(){
  return(
    <DashboardProvider>
      <Dashboard/>
    </DashboardProvider>
  )
}