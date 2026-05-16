import { Calendar, DollarSign, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import { useDashboard } from "../lib/dashboard-store";

const fmtBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function OverviewTab() {
  const { appointments, staff, services, finance } = useDashboard();
  const totalRevenue = appointments.filter(a => a.status === "Concluído").reduce((s, a) => s + a.price, 0);
  const upcoming = appointments.filter(a => a.status === "Marcado").length;
  const completed = appointments.filter(a => a.status === "Concluído").length;
  const lastMonth = finance[finance.length - 1];

  const cards = [
    { label: "Faturamento Mensal", value: fmtBRL(lastMonth.revenue), delta: "+12.4%", icon: DollarSign },
    { label: "Agendamentos", value: String(appointments.length), delta: `${upcoming} pendentes`, icon: Calendar },
    { label: "Concluídos", value: String(completed), delta: fmtBRL(totalRevenue), icon: TrendingUp },
    { label: "Equipe ativa", value: String(staff.filter(s => s.status === "Ativo").length), delta: `${services.length} serviços`, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Visão Geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">Resumo executivo da operação do seu negócio.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-muted p-2.5">
                  <Icon className="h-4 w-4 text-foreground" />
                </div>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" /> {c.delta}
                </span>
              </div>
              <div className="mt-5">
                <div className="text-2xl font-semibold tracking-tight text-foreground">{c.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{c.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Receita ao longo do tempo</h3>
              <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finance}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c026d3" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c026d3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `R$${v/1000}k`} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} formatter={(value) =>
  typeof value === "number"
    ? fmtBRL(value)
    : value
} />
                <Area type="monotone" dataKey="revenue" stroke="#c026d3" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Serviços mais agendados</h3>
          <p className="text-xs text-muted-foreground">Distribuição atual</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={services.map(s => ({ name: s.name.split(" ")[0], count: appointments.filter(a => a.service === s.name).length }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Próximos agendamentos</h3>
          <span className="text-xs text-muted-foreground">{upcoming} marcados</span>
        </div>
        <ul className="divide-y divide-border">
          {appointments.filter(a => a.status === "Marcado").slice(0, 5).map(a => (
            <li key={a.id} className="flex items-center gap-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-foreground">
                {a.client.split(" ").map(s => s[0]).slice(0,2).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{a.client}</div>
                <div className="text-xs text-muted-foreground">{a.service} • {a.staff}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{a.time}</div>
                <div className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString("pt-BR")}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
