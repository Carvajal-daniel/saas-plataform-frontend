"use client";

import * as React from "react";

import { DashboardProvider, useDashboard } from "../lib/dashboard-store";

import { Sidebar, type TabKey } from "../layout/Sidebar";
import { Header } from "../layout/Header";

import { AppointmentsTab } from "./AppointmentsTab";
import { FinancialTab } from "./FinancialTab";
import { ManagementTab } from "./ManagementTab";
import { OverviewTab } from "./OverviewTab";
import { SettingsTab } from "./SettingsTab";

const TITLES: Record<TabKey, string> = {
  overview: "Visão Geral",
  appointments: "Agendamentos",
  financial: "Financeiro",
  management: "Gestão",
  settings: "Configurações",
};



export function Dashboard() {
  const [tab, setTab] = React.useState<TabKey>("overview");
  const [drawer, setDrawer] = React.useState(false);

  const { settings } = useDashboard();

  React.useEffect(() => {
    document.title = `${TITLES[tab]} — ${settings.businessName}`;
  }, [tab, settings.businessName]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar desktop */}
      <div className="sticky top-0 hidden h-screen md:block">
        <Sidebar active={tab} onSelect={setTab} />
      </div>

      {/* Sidebar mobile */}
      {drawer && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
          />

          <div className="absolute left-0 top-0 h-full animate-in slide-in-from-left duration-200">
            <Sidebar
              active={tab}
              onSelect={setTab}
              onNavigate={() => setDrawer(false)}
            />
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onOpenSidebar={() => setDrawer(true)}
          title={TITLES[tab]}
        />

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {tab === "overview" && <OverviewTab />}

            {tab === "appointments" && <AppointmentsTab />}

            {tab === "financial" && <FinancialTab />}

            {tab === "management" && <ManagementTab />}

            {tab === "settings" && <SettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}