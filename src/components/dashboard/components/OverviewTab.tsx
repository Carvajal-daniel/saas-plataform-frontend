import * as React from "react";
import { CalendarDays, DollarSign, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { fmtBRL, useDashboard } from "../lib/dashboard-store";
import { cn } from "@/features/lib/utils";

const todayStr = () => new Date().toISOString().slice(0, 10);

export function OverviewTab() {
  const { appointments, staff, services, navigateTo } = useDashboard();

  const today = todayStr();
  const todays = appointments.filter((a) => a.date === today);
  const monthPrefix = today.slice(0, 7);

  const completedMonth = appointments.filter((a) => a.status === "Concluído" && a.date.startsWith(monthPrefix));
  const grossMonth = completedMonth.reduce((s, a) => s + a.price, 0);
  const commissionMonth = completedMonth.reduce((s, a) => s + (a.commissionEarned ?? 0), 0);
  const netMonth = grossMonth - commissionMonth;

  // last 7 days line series
  const series = React.useMemo(() => {
    const arr: { date: string; label: string; bruto: number; liquido: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const day = appointments.filter((a) => a.status === "Concluído" && a.date === key);
      const bruto = day.reduce((s, a) => s + a.price, 0);
      const com = day.reduce((s, a) => s + (a.commissionEarned ?? 0), 0);
      arr.push({ date: key, label: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), bruto, liquido: bruto - com });
    }
    return arr;
  }, [appointments]);

  const statusCounts = React.useMemo(() => {
    const m = { Marcado: 0, Concluído: 0, Cancelado: 0 };
    appointments.forEach((a) => (m[a.status] += 1));
    return [
      { name: "Marcado", value: m.Marcado, color: "oklch(0.7 0.15 240)" },
      { name: "Concluído", value: m.Concluído, color: "oklch(0.7 0.17 160)" },
      { name: "Cancelado", value: m.Cancelado, color: "oklch(0.65 0.2 25)" },
    ];
  }, [appointments]);

  const cards = [
    { label: "Agendamentos Hoje", value: todays.length, icon: CalendarDays, accent: "from-sky-500/20 to-sky-500/0" },
    { label: "Faturamento do Mês", value: fmtBRL(grossMonth), icon: DollarSign, accent: "from-emerald-500/20 to-emerald-500/0" },
    { label: "Líquido do Mês", value: fmtBRL(netMonth), icon: TrendingUp, accent: "from-orange-500/20 to-orange-500/0" },
    { label: "Equipe Ativa", value: staff.filter((s) => s.status === "Ativo").length, icon: Users, accent: "from-purple-500/20 to-purple-500/0" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={cn("rounded-2xl border border-border bg-card p-5 relative overflow-hidden")}>
            <div className={cn("absolute inset-0 bg-gradient-to-br pointer-events-none opacity-60", c.accent)} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{c.label}</span>
                <c.icon size={16} className="text-muted-foreground" />
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Receita — últimos 7 dias</h3>
              <p className="text-[11px] text-muted-foreground">Bruto vs Líquido (após comissões)</p>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer>
              <LineChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 45)" />
                    <stop offset="100%" stopColor="oklch(0.55 0.22 295)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                 formatter={(value: any) => fmtBRL(Number(value))}
                />
                <Line type="monotone" dataKey="bruto" stroke="url(#g1)" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Bruto" />
                <Line type="monotone" dataKey="liquido" stroke="oklch(0.7 0.17 160)" strokeWidth={2} strokeDasharray="5 4" dot={false} name="Líquido" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl  border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground">Status dos Agendamentos</h3>
          <p className="text-[11px] text-muted-foreground">Distribuição geral</p>
          <div className="h-[240px] mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusCounts} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4} strokeWidth={0}>
                  {statusCounts.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Agendamentos de hoje</h3>
            <button onClick={() => navigateTo("appointments")} className="text-[11px] text-primary font-semibold inline-flex items-center gap-1 hover:underline">
              Ver agenda <ArrowUpRight size={11} />
            </button>
          </div>
          {todays.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhum agendamento para hoje.</p>
          ) : (
            <ul className="divide-y divide-border">
              {todays.sort((a, b) => a.time.localeCompare(b.time)).map((a) => (
                <li key={a.id} className="py-2.5 flex items-center gap-3">
                  <span className="text-xs font-bold tabular-nums w-12">{a.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{a.client}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{a.service} · {a.staff}</p>
                  </div>
                  <span className="text-xs font-semibold text-foreground">{fmtBRL(a.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold mb-3">Top serviços</h3>
          <ul className="space-y-3">
            {services.slice(0, 4).map((s) => {
              const count = appointments.filter((a) => a.service === s.name && a.status === "Concluído").length;
              const total = Math.max(...services.map((sv) => appointments.filter((a) => a.service === sv.name && a.status === "Concluído").length), 1);
              return (
                <li key={s.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{count} realizados</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full btn-primary-gradient" style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
