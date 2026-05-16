import * as React from "react";
import { Bell, Menu, Moon, Sun, Search } from "lucide-react";
import { useDashboard } from "../lib/dashboard-store";
import { Button } from "@/components/ui/Button";
import { cn } from "@/features/lib/utils";

export function Header({ onOpenSidebar, title }: { onOpenSidebar: () => void; title: string }) {
  const { settings, notifications, setNotifications, dark, toggleDark } = useDashboard();
  const [openNotif, setOpenNotif] = React.useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSidebar}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-baseline gap-2">
        <span className="text-sm font-semibold tracking-tight text-foreground md:hidden">{settings.businessName}</span>
        <span className="hidden text-sm font-medium text-muted-foreground md:inline">{title}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Buscar..."
            className="h-9 w-56 rounded-lg border border-input bg-card/60 pl-9 pr-3 text-sm outline-none transition-all focus:w-72 focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Alternar tema">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setOpenNotif(o => !o)} aria-label="Notificações">
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
              </span>
            )}
          </Button>
          {openNotif && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpenNotif(false)} />
              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div className="text-sm font-semibold">Notificações</div>
                  <button
                    onClick={() => setNotifications(ns => ns.map(n => ({ ...n, read: true })))}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >Marcar todas como lidas</button>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <li key={n.id} className={cn("flex gap-3 border-b border-border/60 p-4 last:border-0 transition-colors hover:bg-muted/40", !n.read && "bg-muted/30")}>
                      <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-border" : "btn-primary-gradient")} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground">{n.title}</div>
                        <div className="truncate text-xs text-muted-foreground">{n.message}</div>
                        <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{n.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full btn-primary-gradient text-sm font-semibold text-white">
          {settings.avatar ? <img src={settings.avatar} alt="avatar" className="h-full w-full object-cover" /> : settings.profileName.split(" ").map(s => s[0]).slice(0,2).join("")}
        </div>
      </div>
    </header>
  );
}
