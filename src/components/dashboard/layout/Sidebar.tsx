import { LayoutDashboard, Calendar, Wallet, Users, Settings, Sparkles } from "lucide-react";
import { useDashboard } from "../lib/dashboard-store";
import { cn } from "@/features/lib/utils";
export type TabKey = "overview" | "appointments" | "financial" | "management" | "settings";

const items: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { key: "appointments", label: "Agendamentos", icon: Calendar },
  { key: "financial", label: "Financeiro", icon: Wallet },
  { key: "management", label: "Gestão", icon: Users },
  { key: "settings", label: "Configurações", icon: Settings },
];

export function Sidebar({ active, onSelect, onNavigate }: { active: TabKey; onSelect: (k: TabKey) => void; onNavigate?: () => void }) {
  const { settings } = useDashboard();
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card/60 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl btn-primary-gradient">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-foreground">{settings.businessName}</div>
          <div className="text-xs text-muted-foreground">Painel de controle</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { onSelect(item.key); onNavigate?.(); }}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-foreground/5 text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-transform", isActive && "text-foreground")} />
              <span>{item.label}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full btn-primary-gradient" />}
            </button>
          );
        })}
      </nav>
      <div className="m-3 rounded-xl border border-border bg-muted/40 p-4">
        <div className="text-xs font-semibold text-foreground">Plano Premium</div>
        <div className="mt-1 text-xs text-muted-foreground">Recursos ilimitados ativos</div>
      </div>
    </aside>
  );
}
