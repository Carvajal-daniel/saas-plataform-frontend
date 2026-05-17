"use client";

import * as React from "react";
import {
  Bell,
  Menu,
  X as XIcon,
  Search,
  Sparkles,
  Check,
  CalendarDays,
  Wallet,
  LayoutDashboard,
  BarChart3,
  Settings,
  ClipboardList,
} from "lucide-react";

import { useDashboard } from "../lib/dashboard-store";
import { cn } from "@/features/lib/utils";

// Mapeamento de ícones para o menu mobile
const tabIcons: Record<string, any> = {
  overview: LayoutDashboard,
  appointments: CalendarDays,
  financial: Wallet,
  management: BarChart3,
  settings: Settings,
};

const titles: Record<
  string,
  {
    title: string;
    sub: string;
  }
> = {
  overview: {
    title: "Visão Geral",
    sub: "Resumo de hoje e métricas-chave",
  },

  appointments: {
    title: "Agenda",
    sub: "Gerencie agendamentos e disponibilidade",
  },

  financial: {
    title: "Financeiro",
    sub: "Faturamento, comissões e pagamentos",
  },

  management: {
    title: "Gestão",
    sub: "Funcionários e serviços",
  },

  settings: {
    title: "Ajustes",
    sub: "Identidade do negócio",
  },
};

export function Header({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const {
    business,
    notifications,
    activeTab,
    markNotificationRead,
    markAllRead,
    navigateTo,

    // SEARCH
    search,
    setSearch,
    globalSearch,
  } = useDashboard();

  const results = React.useMemo(() => {
    if (!search.trim()) return [];

    return globalSearch(search);
  }, [search, globalSearch]);

  const [openNotif, setOpenNotif] =
    React.useState(false);

  const [
    openMobileMenu,
    setOpenMobileMenu,
  ] = React.useState(false);

  const notifRef =
    React.useRef<HTMLDivElement>(null);

  const menuRef =
    React.useRef<HTMLDivElement>(null);

  // Fecha menus ao clicar fora
  React.useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(
          e.target as Node
        )
      ) {
        setOpenNotif(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setOpenMobileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      fn
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        fn
      );
    };
  }, []);

  const unread =
    notifications.filter(
      (n) => !n.read
    ).length;

  const t = titles[activeTab] || {
    title: "Painel",
    sub: "Gerenciamento",
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 md:px-8 py-3.5">
        {/* MENU */}
        <div
          ref={menuRef}
          className="relative"
        >
          <button
            onClick={() => {
              if (
                window.innerWidth < 768
              ) {
                setOpenMobileMenu(
                  (o) => !o
                );
              } else {
                onToggleSidebar();
              }
            }}
            type="button"
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {openMobileMenu ? (
              <XIcon size={18} />
            ) : (
              <Menu size={18} />
            )}
          </button>

          {openMobileMenu && (
            <div className="absolute left-0 top-12 w-56 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="h-1 w-full btn-primary-gradient" />

              <div className="p-2 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-3 py-1.5">
                  Navegação
                </p>

                {Object.keys(
                  titles
                ).map((key) => {
                  const item =
                    titles[key];

                  const Icon =
                    tabIcons[key] ||
                    ClipboardList;

                  const isActive =
                    activeTab === key;

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        navigateTo(
                          key as any
                        );

                        setOpenMobileMenu(
                          false
                        );
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                        isActive
                          ? "btn-primary-gradient text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon
                        size={16}
                        className={cn(
                          isActive
                            ? "text-white"
                            : "text-muted-foreground"
                        )}
                      />

                      <span>
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* BRAND */}
        <div className="md:hidden flex items-center gap-2">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt=""
              className="w-7 h-7 rounded-lg object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-lg btn-primary-gradient flex items-center justify-center">
              <Sparkles
                size={12}
                className="text-white"
              />
            </div>
          )}

          <span className="text-sm font-bold truncate max-w-[120px]">
            {business.name}
          </span>
        </div>

        {/* TITULO */}
        <div>
          <h1 className="text-sm md:text-lg font-bold tracking-tight text-foreground leading-none md:leading-normal">
            {t.title}
          </h1>

          <p className="text-[11px] md:text-xs text-muted-foreground hidden sm:block">
            {t.sub}
          </p>
        </div>

        {/* SEARCH */}
        <div className="hidden lg:flex relative items-center gap-2 ml-6 px-3 py-2 rounded-xl bg-muted/60 border border-border w-72">
          <Search
            size={14}
            className="text-muted-foreground"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key !== "Enter"
              ) {
                return;
              }

              const first =
                results[0];

              if (!first) return;

              if (
                first.type ===
                "appointment"
              ) {
                navigateTo(
                  "appointments",
                  {
                    appointmentId:
                      first.id,
                  }
                );
              }

              if (
                first.type ===
                  "service" ||
                first.type ===
                  "staff"
              ) {
                navigateTo(
                  "management"
                );
              }

              setSearch("");
            }}
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground/60"
            placeholder="Buscar clientes, serviços..."
          />

          {/* RESULTS */}
          {results.length > 0 && (
            <div className="absolute top-12 left-0 w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-50">
              {results
                .slice(0, 6)
                .map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      if (
                        r.type ===
                        "appointment"
                      ) {
                        navigateTo(
                          "appointments",
                          {
                            appointmentId:
                              r.id,
                          }
                        );
                      }

                      if (
                        r.type ===
                          "service" ||
                        r.type ===
                          "staff"
                      ) {
                        navigateTo(
                          "management"
                        );
                      }

                      setSearch("");
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted border-b border-border last:border-b-0 transition-colors"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {r.title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {r.subtitle}
                    </p>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* NOTIFICAÇÕES */}
        <div
          className="ml-auto flex items-center gap-2 relative"
          ref={notifRef}
        >
          <button
            onClick={() =>
              setOpenNotif((o) => !o)
            }
            className="relative p-2.5 rounded-xl border border-border bg-card hover:bg-muted transition-colors"
            aria-label="Notificações"
          >
            <Bell size={16} />

            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full btn-primary-gradient text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unread}
              </span>
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 top-12 w-[340px] max-w-[90vw] rounded-2xl bg-card border border-border shadow-2xl overflow-hidden z-50">
              <div className="h-1 w-full btn-primary-gradient" />

              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-bold">
                  Notificações
                </p>

                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-primary font-semibold hover:underline"
                  >
                    Marcar todas
                  </button>
                )}
              </div>

              <div className="max-h-[360px] overflow-auto">
                {notifications.length ===
                0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    Nenhuma
                    notificação
                  </div>
                ) : (
                  notifications.map(
                    (n) => {
                      const Icon =
                        n.type ===
                        "financial"
                          ? Wallet
                          : CalendarDays;

                      return (
                        <button
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(
                              n.id
                            );

                            setOpenNotif(
                              false
                            );

                            navigateTo(
                              n.type ===
                                "financial"
                                ? "financial"
                                : "appointments",
                              {
                                appointmentId:
                                  n.targetId,
                              }
                            );
                          }}
                          className={cn(
                            "w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/60 transition-colors border-b border-border/60 last:border-b-0",
                            !n.read &&
                              "bg-primary/[0.04]"
                          )}
                        >
                          <div
                            className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                              n.read
                                ? "bg-muted text-muted-foreground"
                                : "btn-primary-gradient text-white"
                            )}
                          >
                            {n.read ? (
                              <Check
                                size={
                                  13
                                }
                              />
                            ) : (
                              <Icon
                                size={
                                  13
                                }
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground leading-snug">
                              {n.text}
                            </p>

                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {new Date(
                                n.createdAt
                              ).toLocaleString(
                                "pt-BR",
                                {
                                  hour: "2-digit",
                                  minute:
                                    "2-digit",
                                  day: "2-digit",
                                  month:
                                    "2-digit",
                                }
                              )}
                            </p>
                          </div>

                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          )}
                        </button>
                      );
                    }
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}