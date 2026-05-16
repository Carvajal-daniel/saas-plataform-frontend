import * as React from "react";
import { Download, TrendingUp, TrendingDown, Percent, Check } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/Button";
import { Modal } from "./Modal";
import { useDashboard } from "../lib/dashboard-store";

const fmtBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function FinancialTab() {
  const { finance, settings } = useDashboard();
  const [month, setMonth] = React.useState(finance[finance.length - 1].month);
  const [exportOpen, setExportOpen] = React.useState(false);
  const [exported, setExported] = React.useState(false);

  const current = finance.find(f => f.month === month)!;
  const profit = current.revenue - current.expenses;
  const margin = (profit / current.revenue) * 100;

  const doExport = () => {
    setExported(true);
    setTimeout(() => { setExported(false); setExportOpen(false); }, 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Financeiro</h1>
          <p className="mt-1 text-sm text-muted-foreground">Análise comparativa de receitas, despesas e margens.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={month} onChange={e => setMonth(e.target.value)}
            className="h-10 rounded-lg border border-input bg-card px-4 text-sm font-medium text-foreground outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/20">
            {finance.map(f => <option key={f.month} value={f.month}>Mês: {f.month}</option>)}
          </select>
          <Button onClick={() => setExportOpen(true)} className="btn-primary-gradient h-10 px-5">
            <Download className="h-4 w-4" /> Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Faturamento" value={fmtBRL(current.revenue)} icon={TrendingUp} tone="emerald" />
        <Stat label="Despesas" value={fmtBRL(current.expenses)} icon={TrendingDown} tone="rose" />
        <Stat label="Lucro líquido" value={fmtBRL(profit)} icon={TrendingUp} tone="violet" />
        <Stat label="Margem" value={`${margin.toFixed(1)}%`} icon={Percent} tone="sky" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">Faturamento vs Despesas</h3>
            <p className="text-xs text-muted-foreground">Tendência comparativa dos últimos 6 meses</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={finance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `R$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} formatter={(value) => {
                if (typeof value === "number") {
                  return fmtBRL(value);
                }

                return value;
              }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" name="Faturamento" dataKey="revenue" stroke="#c026d3" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" name="Despesas" dataKey="expenses" stroke="#ff6b35" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Custos fixos vs variáveis</h3>
          <p className="text-xs text-muted-foreground">Distribuição em {month}</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: "Fixos", value: current.fixedCosts }, { name: "Variáveis", value: current.variableCosts }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `R$${v / 1000}k`} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} formatter={(value) => {
                  if (typeof value === "number") {
                    return fmtBRL(value);
                  }

                  return value;
                }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Relatório explicativo</h3>
          <p className="text-xs text-muted-foreground">Resumo de {month}</p>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Receita bruta" value={fmtBRL(current.revenue)} />
            <Row label="Despesas totais" value={fmtBRL(current.expenses)} negative />
            <Row label="Custos fixos" value={fmtBRL(current.fixedCosts)} />
            <Row label="Custos variáveis" value={fmtBRL(current.variableCosts)} />
            <div className="my-2 border-t border-border" />
            <Row label="Lucro líquido" value={fmtBRL(profit)} strong />
            <Row label="Margem líquida" value={`${margin.toFixed(1)}%`} strong />
          </dl>
          <p className="mt-4 rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
            Em <strong className="text-foreground">{month}</strong>, {settings.businessName} registrou receita de <strong className="text-foreground">{fmtBRL(current.revenue)}</strong>, com despesas correspondendo a <strong className="text-foreground">{((current.expenses / current.revenue) * 100).toFixed(1)}%</strong> do faturamento. Os custos fixos representam <strong className="text-foreground">{((current.fixedCosts / current.expenses) * 100).toFixed(0)}%</strong> das despesas, indicando estrutura operacional estável.
          </p>
        </div>
      </div>

      <Modal open={exportOpen} onClose={() => setExportOpen(false)} title="Pré-visualização do Relatório"
        footer={<>
          <Button variant="ghost" onClick={() => setExportOpen(false)}>Fechar</Button>
          <Button onClick={doExport} className="btn-primary-gradient">
            {exported ? <><Check className="h-4 w-4" /> Exportado!</> : <><Download className="h-4 w-4" /> Confirmar exportação</>}
          </Button>
        </>}
      >
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <div>
              <div className="text-lg font-semibold tracking-tight text-foreground">{settings.businessName}</div>
              <div className="text-xs text-muted-foreground">Relatório financeiro — {month}</div>
            </div>
            <div className="text-xs text-muted-foreground">Emitido em {new Date().toLocaleDateString("pt-BR")}</div>
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="Receita" value={fmtBRL(current.revenue)} />
            <Row label="Despesas" value={fmtBRL(current.expenses)} />
            <Row label="Lucro líquido" value={fmtBRL(profit)} strong />
            <Row label="Margem" value={`${margin.toFixed(1)}%`} strong />
          </dl>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value, strong, negative }: { label: string; value: string; strong?: boolean; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={strong ? "font-semibold text-foreground" : negative ? "text-rose-600 dark:text-rose-400" : "text-foreground"}>{value}</dd>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; tone: "emerald" | "rose" | "violet" | "sky" }) {
  const tones = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className={`inline-flex rounded-xl p-2.5 ${tones[tone]}`}><Icon className="h-4 w-4" /></div>
      <div className="mt-5 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
