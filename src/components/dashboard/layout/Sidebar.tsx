
import { LayoutDashboard, CalendarDays, Wallet, Users, Settings, Sparkles, LogOut, Loader2 } from "lucide-react";
import { useDashboard, type TabKey } from "../lib/dashboard-store";
import { cn } from "@/features/lib/utils";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/features/auth/components/login/api-client";

const items: { key: TabKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "overview",     label: "Visão Geral", icon: LayoutDashboard },
  { key: "appointments", label: "Agenda",      icon: CalendarDays },
  { key: "financial",    label: "Financeiro",  icon: Wallet },
  { key: "management",   label: "Gestão",      icon: Users },
  { key: "settings",     label: "Ajustes",     icon: Settings },
];



export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { activeTab, setActiveTab, business } = useDashboard();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
const router = useRouter();




const logout = async () => {
  try {
    setIsLoggingOut(true);

    toast("Encerrando sessão...", {
      description: "Saindo do painel...",
    });

    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );

    await logoutAction();

    toast("Sessão encerrada.", {
      description:
        "Você foi desconectado.",
    });

    router.replace("/client/login");
    router.refresh();
  } catch (error) {
    console.error(error);

    toast("Erro ao sair.");
  } finally {
    setIsLoggingOut(false);
  }
};
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card/60 backdrop-blur-md transition-all duration-200 sticky top-0 h-screen",
        collapsed ? "w-[76px]" : "w-[248px]",
      )}
    >
      <div className={cn("flex items-center gap-3 px-5 py-5 border-b border-border", collapsed && "justify-center px-2")}>
        {business.logoUrl ? (
          <img src={business.logoUrl} alt="logo" className="w-9 h-9 rounded-xl object-cover ring-1 ring-border" />
        ) : (
          <div className="w-9 h-9 rounded-xl btn-primary-gradient flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{business.name}</p>
            <p className="text-[11px] text-muted-foreground">Painel Admin</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const active = activeTab === it.key;
          const Icon = it.icon;
          return (
            <button
              key={it.key}
              onClick={() => setActiveTab(it.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full btn-primary-gradient" />}
              <Icon size={17} className={cn("shrink-0", active && "text-primary")} />
              {!collapsed && <span>{it.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-3">
          <div className="rounded-2xl p-4 glass">
            <p className="text-xs font-semibold text-foreground">Altair Premium</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Painel Neo-Minimalist</p>
            
          </div>
           <div className="rounded-2xl border border-border p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">Sair da conta</p>
          <p className="text-[11px] text-muted-foreground">Encerrar a sessão atual</p>
        </div>
       <Button onClick={logout} disabled={isLoggingOut} className={"btn-primary-gradient text-white cursor-pointer"}>
  {isLoggingOut ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin " />
      Saindo...
    </div>
  ) : (
    "Sair"
  )}
</Button>
      </div>
        </div>
      )}
    </aside>
  );
}
