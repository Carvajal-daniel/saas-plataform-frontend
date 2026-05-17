"use client";

import * as React from "react";
import { useDashboard } from "../lib/dashboard-store";
import { Sidebar } from "../layout/Sidebar";
import { Header } from "../layout/Header";
import { AppointmentsTab } from "./AppointmentsTab";
import { FinancialTab } from "./FinancialTab";
import { ManagementTab } from "./ManagementTab";
import { OverviewTab } from "./OverviewTab";
import { SettingsTab } from "./SettingsTab";

export function Dashboard() {
  const { activeTab } = useDashboard();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main className="flex-1 px-4 md:px-8 py-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "appointments" && <AppointmentsTab />}
          {activeTab === "financial" && <FinancialTab />}
          {activeTab === "management" && <ManagementTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}