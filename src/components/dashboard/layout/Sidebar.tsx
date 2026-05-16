"use client";

import {
  LayoutDashboard,
  Calendar,
  Wallet,
  Users,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useDashboard } from "../lib/dashboard-store";

import { cn } from "@/features/lib/utils";

export type TabKey =
  | "overview"
  | "appointments"
  | "financial"
  | "management"
  | "settings";

const items: {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}[] = [
  {
    key: "overview",
    label: "Visão Geral",
    icon: LayoutDashboard,
  },
  {
    key: "appointments",
    label: "Agendamentos",
    icon: Calendar,
  },
  {
    key: "financial",
    label: "Financeiro",
    icon: Wallet,
  },
  {
    key: "management",
    label: "Gestão",
    icon: Users,
  },
  {
    key: "settings",
    label: "Configurações",
    icon: Settings,
  },
];

export function Sidebar({
  active,
  onSelect,
  onNavigate,
}: {
  active: TabKey;
  onSelect: (k: TabKey) => void;
  onNavigate?: () => void;
}) {
  const { settings } = useDashboard();

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/client/login");
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card/60 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl btn-primary-gradient">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        <div>
          <div className="text-sm font-semibold tracking-tight text-foreground">
            {settings.businessName}
          </div>

          <div className="text-xs text-muted-foreground">
            Painel de controle
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;

          const isActive =
            active === item.key;

          return (
            <button
              key={item.key}
              onClick={() => {
                onSelect(item.key);

                onNavigate?.();
              }}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-foreground/5 text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-transform",
                  isActive &&
                    "text-foreground"
                )}
              />

              <span>{item.label}</span>

              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full btn-primary-gradient" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-border bg-muted/40 p-4">
        <div className="text-xs font-semibold text-foreground">
          Plano Premium
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          Recursos ilimitados ativos
        </div>
      </div>

      <div className="px-3 pb-4">
  <button
    onClick={handleLogout}
    className="group relative cursor-pointer flex w-full items-center overflow-hidden rounded-2xl border border-rose-500/10 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent px-4 py-3 text-sm font-medium text-rose-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-500/20 hover:from-rose-500/15 hover:via-rose-500/10 hover:to-rose-500/5 hover:shadow-lg hover:shadow-rose-500/10"
  >
    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="absolute -left-10 top-0 h-full w-20 rotate-12 bg-white/10 blur-xl" />
    </div>

    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 transition-all duration-300 group-hover:bg-rose-500/20">
      <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
    </div>

    <div className="relative ml-3 flex flex-1 flex-col items-start">
      <span className="font-semibold tracking-tight">
        Sair da conta
      </span>

      <span className="text-xs text-rose-400/80">
        Encerrar sessão atual
      </span>
    </div>

    <div className="relative">
      <div className="h-2 w-2 rounded-full bg-rose-500/70 transition-all duration-300 group-hover:scale-125 group-hover:bg-rose-400" />
    </div>
  </button>
</div>
    </aside>
  );
}