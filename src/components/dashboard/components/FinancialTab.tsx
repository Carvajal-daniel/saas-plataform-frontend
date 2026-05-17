"use client";

import * as React from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { Wallet, TrendingUp, Calendar, CheckCircle2, Users, FileDown } from "lucide-react";
import { fmtBRL, useDashboard } from "../lib/dashboard-store";
import { Button } from "@/components/ui/Button";
import { cn } from "@/features/lib/utils";
import { toast } from "sonner";

type SubView = "daily" | "monthly" | "payroll";

const todayStr = () => new Date().toISOString().slice(0, 10);
const monthKey = (d: string) => d.slice(0, 7);

export function FinancialTab() {
  const { appointments, staff, setAppointments, pushNotification } = useDashboard();
  const [view, setView] = React.useState<SubView>("daily");
  const [exporting, setExporting] = React.useState(false);

  const today = todayStr();
  const month = monthKey(today);
  const completed = React.useMemo(() => appointments.filter((a) => a.status === "Concluído"), [appointments]);

  const dailyGross = completed.filter((a) => a.date === today).reduce((s, a) => s + a.price, 0);
  const dailyComm = completed.filter((a) => a.date === today).reduce((s, a) => s + (a.commissionEarned ?? 0), 0);
  const dailyNet = dailyGross - dailyComm;

  const monthGross = completed.filter((a) => a.date.startsWith(month)).reduce((s, a) => s + a.price, 0);
  const monthComm = completed.filter((a) => a.date.startsWith(month)).reduce((s, a) => s + (a.commissionEarned ?? 0), 0);
  const monthNet = monthGross - monthComm;

  // last 14 days for daily chart
  const dailySeries = React.useMemo(() => {
    const arr: { label: string; bruto: number; liquido: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const day = completed.filter((a) => a.date === k);
      const bruto = day.reduce((s, a) => s + a.price, 0);
      const com = day.reduce((s, a) => s + (a.commissionEarned ?? 0), 0);
      arr.push({ label: `${d.getDate()}/${d.getMonth() + 1}`, bruto, liquido: bruto - com });
    }
    return arr;
  }, [completed]);

  // last 6 months
  const monthSeries = React.useMemo(() => {
    const arr: { label: string; bruto: number; liquido: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthData = completed.filter((a) => a.date.startsWith(k));
      const bruto = monthData.reduce((s, a) => s + a.price, 0);
      const com = monthData.reduce((s, a) => s + (a.commissionEarned ?? 0), 0);
      arr.push({ label: d.toLocaleDateString("pt-BR", { month: "short" }), bruto, liquido: bruto - com });
    }
    return arr;
  }, [completed]);

  // payroll
  const payroll = React.useMemo(() => {
    return staff.map((s) => {
      const services = completed.filter((a) => a.staff === s.name);
      const totalGross = services.reduce((sum, a) => sum + a.price, 0);
      const totalComm = services.reduce((sum, a) => sum + (a.commissionEarned ?? 0), 0);
      const unpaid = services.filter((a) => !a.paid);
      const toPay = unpaid.reduce((sum, a) => sum + (a.commissionEarned ?? 0), 0);
      return { staff: s, count: services.length, totalGross, totalComm, toPay, unpaidIds: unpaid.map((a) => a.id) };
    });
  }, [staff, completed]);

  const markPaid = (ids: string[], name: string, amount: number) => {
    setAppointments((arr) =>
      arr.map((a) => (ids.includes(a.id) ? { ...a, paid: true } : a))
    );
    pushNotification({
      text: `Pagamento de ${fmtBRL(amount)} para ${name} foi marcado como pago.`,
      type: "financial",
    });
    toast.success(`Pagamento de ${fmtBRL(amount)} confirmado com sucesso!`);
  };

  // ── Export PDF ─────────────────────────────────────────────────────────────
  const exportReport = async () => {
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageW = doc.internal.pageSize.getWidth();
      const margin = 16;
      const colW = (pageW - margin * 2) / 2;
      let y = 0;

      // ── helpers ──────────────────────────────────────────────────────────
      const addPage = () => {
        doc.addPage();
        y = margin;
      };

      const checkY = (needed: number) => {
        if (y + needed > doc.internal.pageSize.getHeight() - margin) addPage();
      };

      // ── Header bar ───────────────────────────────────────────────────────
      doc.setFillColor(30, 30, 30);
      doc.rect(0, 0, pageW, 28, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("Relatório Financeiro", margin, 17);

      const dateLabel = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit", month: "long", year: "numeric",
      });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(180, 180, 180);
      doc.text(`Gerado em ${dateLabel}`, pageW - margin, 17, { align: "right" });

      y = 38;

      // ── Section title helper ──────────────────────────────────────────────
      const sectionTitle = (title: string) => {
        checkY(14);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.text(title.toUpperCase(), margin, y);
        // underline accent
        doc.setDrawColor(200, 150, 80);
        doc.setLineWidth(0.6);
        doc.line(margin, y + 1.5, margin + doc.getTextWidth(title.toUpperCase()), y + 1.5);
        y += 8;
      };

      // ── Metric card helper (two-column) ───────────────────────────────────
      const metricCard = (
        label: string,
        value: string,
        sub: string,
        col: 0 | 1,
        rowY: number
      ) => {
        const x = margin + col * (colW + 4);
        doc.setFillColor(248, 248, 248);
        doc.roundedRect(x, rowY, colW - 2, 22, 3, 3, "F");
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, rowY, colW - 2, 22, 3, 3, "S");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.text(label, x + 5, rowY + 7);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text(value, x + 5, rowY + 15);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.text(sub, x + 5, rowY + 20);
      };

      // ── 1. RESUMO DO DIA ─────────────────────────────────────────────────
      sectionTitle("Resumo do Dia");
      checkY(26);
      metricCard("Faturamento Bruto", fmtBRL(dailyGross), `Líquido ${fmtBRL(dailyNet)}`, 0, y);
      metricCard(
        "Comissões",
        fmtBRL(dailyComm),
        `${completed.filter((a) => a.date === today).length} atendimento(s)`,
        1,
        y
      );
      y += 26;

      // ── 2. RESUMO DO MÊS ─────────────────────────────────────────────────
      sectionTitle("Resumo do Mês");
      checkY(26);
      metricCard("Faturamento Bruto", fmtBRL(monthGross), `Líquido ${fmtBRL(monthNet)}`, 0, y);
      metricCard(
        "Comissões do Mês",
        fmtBRL(monthComm),
        `A pagar ${fmtBRL(payroll.reduce((s, p) => s + p.toPay, 0))}`,
        1,
        y
      );
      y += 26;

      // ── 3. ÚLTIMOS 14 DIAS ────────────────────────────────────────────────
      sectionTitle("Últimos 14 Dias");

      // table header
      checkY(8);
      const cols14 = [margin, margin + 30, margin + 70, margin + 110];
      doc.setFillColor(40, 40, 40);
      doc.rect(margin, y, pageW - margin * 2, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      ["Dia", "Bruto", "Comissões", "Líquido"].forEach((h, i) => doc.text(h, cols14[i] + 2, y + 4.8));
      y += 7;

      dailySeries.forEach((row, idx) => {
        checkY(7);
        if (idx % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, y, pageW - margin * 2, 7, "F");
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(50, 50, 50);
        const comm = row.bruto - row.liquido;
        [row.label, fmtBRL(row.bruto), fmtBRL(comm), fmtBRL(row.liquido)].forEach((v, i) =>
          doc.text(v, cols14[i] + 2, y + 4.8)
        );
        y += 7;
      });

      // totals row
      checkY(8);
      const total14Bruto = dailySeries.reduce((s, r) => s + r.bruto, 0);
      const total14Liq = dailySeries.reduce((s, r) => s + r.liquido, 0);
      const total14Comm = total14Bruto - total14Liq;
      doc.setFillColor(235, 235, 235);
      doc.rect(margin, y, pageW - margin * 2, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 30, 30);
      doc.text("TOTAL", cols14[0] + 2, y + 5.5);
      doc.text(fmtBRL(total14Bruto), cols14[1] + 2, y + 5.5);
      doc.text(fmtBRL(total14Comm), cols14[2] + 2, y + 5.5);
      doc.text(fmtBRL(total14Liq), cols14[3] + 2, y + 5.5);
      y += 12;

      // ── 4. ÚLTIMOS 6 MESES ────────────────────────────────────────────────
      sectionTitle("Últimos 6 Meses");

      checkY(8);
      const cols6 = [margin, margin + 30, margin + 75, margin + 120];
      doc.setFillColor(40, 40, 40);
      doc.rect(margin, y, pageW - margin * 2, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      ["Mês", "Bruto", "Comissões", "Líquido"].forEach((h, i) => doc.text(h, cols6[i] + 2, y + 4.8));
      y += 7;

      monthSeries.forEach((row, idx) => {
        checkY(7);
        if (idx % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, y, pageW - margin * 2, 7, "F");
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(50, 50, 50);
        const comm = row.bruto - row.liquido;
        [row.label, fmtBRL(row.bruto), fmtBRL(comm), fmtBRL(row.liquido)].forEach((v, i) =>
          doc.text(v, cols6[i] + 2, y + 4.8)
        );
        y += 7;
      });

      // totals
      checkY(8);
      const total6Bruto = monthSeries.reduce((s, r) => s + r.bruto, 0);
      const total6Liq = monthSeries.reduce((s, r) => s + r.liquido, 0);
      const total6Comm = total6Bruto - total6Liq;
      doc.setFillColor(235, 235, 235);
      doc.rect(margin, y, pageW - margin * 2, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 30, 30);
      doc.text("TOTAL", cols6[0] + 2, y + 5.5);
      doc.text(fmtBRL(total6Bruto), cols6[1] + 2, y + 5.5);
      doc.text(fmtBRL(total6Comm), cols6[2] + 2, y + 5.5);
      doc.text(fmtBRL(total6Liq), cols6[3] + 2, y + 5.5);
      y += 12;

      // ── 5. PAGAMENTO DE FUNCIONÁRIOS ─────────────────────────────────────
      sectionTitle("Pagamento de Funcionários");

      checkY(8);
      const colsP = [margin, margin + 45, margin + 80, margin + 115];
      doc.setFillColor(40, 40, 40);
      doc.rect(margin, y, pageW - margin * 2, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      ["Funcionário", "Atendimentos", "Comissão Total", "A Pagar"].forEach((h, i) =>
        doc.text(h, colsP[i] + 2, y + 4.8)
      );
      y += 7;

      payroll.forEach((p, idx) => {
        checkY(7);
        if (idx % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(margin, y, pageW - margin * 2, 7, "F");
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(50, 50, 50);
        [
          `${p.staff.name} (${p.staff.commissionRate}%)`,
          String(p.count),
          fmtBRL(p.totalComm),
          fmtBRL(p.toPay),
        ].forEach((v, i) => doc.text(v, colsP[i] + 2, y + 4.8));
        y += 7;
      });

      // payroll totals
      checkY(8);
      const totalPayComm = payroll.reduce((s, p) => s + p.totalComm, 0);
      const totalToPay = payroll.reduce((s, p) => s + p.toPay, 0);
      doc.setFillColor(235, 235, 235);
      doc.rect(margin, y, pageW - margin * 2, 8, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 30, 30);
      doc.text("TOTAL", colsP[0] + 2, y + 5.5);
      doc.text(String(payroll.reduce((s, p) => s + p.count, 0)), colsP[1] + 2, y + 5.5);
      doc.text(fmtBRL(totalPayComm), colsP[2] + 2, y + 5.5);
      doc.text(fmtBRL(totalToPay), colsP[3] + 2, y + 5.5);
      y += 12;

      // ── Footer on every page ─────────────────────────────────────────────
      const pageCount = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const ph = doc.internal.pageSize.getHeight();
        doc.setFillColor(30, 30, 30);
        doc.rect(0, ph - 10, pageW, 10, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(160, 160, 160);
        doc.text("Relatório gerado automaticamente pelo sistema", margin, ph - 3.5);
        doc.text(`Página ${i} de ${pageCount}`, pageW - margin, ph - 3.5, { align: "right" });
      }

      // ── Save ─────────────────────────────────────────────────────────────
      const filename = `relatorio-financeiro-${today}.pdf`;
      doc.save(filename);
      toast.success("Relatório exportado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao exportar relatório.");
    } finally {
      setExporting(false);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  const cards = [
    { label: "Faturamento Diário", value: fmtBRL(dailyGross), sub: `Líquido ${fmtBRL(dailyNet)}`, icon: Calendar },
    { label: "Comissões Hoje", value: fmtBRL(dailyComm), sub: `${completed.filter((a) => a.date === today).length} atendimentos`, icon: TrendingUp },
    { label: "Faturamento do Mês", value: fmtBRL(monthGross), sub: `Líquido ${fmtBRL(monthNet)}`, icon: Wallet },
    { label: "Comissões do Mês", value: fmtBRL(monthComm), sub: `A pagar ${fmtBRL(payroll.reduce((s, p) => s + p.toPay, 0))}`, icon: Users },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</span>
              <c.icon size={15} className="text-muted-foreground" />
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight">{c.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Sub-view tabs + Export button ── */}
      <div className="flex flex-wrap items-center gap-2">
        {([
          { k: "daily", l: "Diário" },
          { k: "monthly", l: "Mensal" },
          { k: "payroll", l: "Pagamento de Funcionários" },
        ] as { k: SubView; l: string }[]).map((t) => (
          <button
            key={t.k}
            onClick={() => setView(t.k)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
              view === t.k
                ? "btn-primary-gradient border-transparent text-white"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            )}
          >
            {t.l}
          </button>
        ))}

        {/* Export button — same pill style, sits at the end */}
        <button
          onClick={exportReport}
          disabled={exporting}
          className={cn(
            "ml-auto px-4 py-2 rounded-xl text-sm font-medium border transition-all inline-flex items-center gap-1.5",
            "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
            exporting && "opacity-60 cursor-not-allowed"
          )}
        >
          <FileDown size={14} />
          {exporting ? "Exportando…" : "Exportar Relatório"}
        </button>
      </div>

      {view === "daily" && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold">Receita Diária — últimos 14 dias</h3>
          <p className="text-[11px] text-muted-foreground">Bruto vs Líquido após comissões</p>
          <div className="h-[320px] mt-4">
            <ResponsiveContainer>
              <AreaChart data={dailySeries} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 45)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 45)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.22 295)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.55 0.22 295)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(value: any) => fmtBRL(Number(value))} />
                <Area type="monotone" dataKey="bruto" stroke="oklch(0.72 0.19 45)" strokeWidth={2.5} fill="url(#ga)" name="Bruto" />
                <Area type="monotone" dataKey="liquido" stroke="oklch(0.55 0.22 295)" strokeWidth={2.5} fill="url(#gb)" name="Líquido" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === "monthly" && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-bold">Receita Mensal — últimos 6 meses</h3>
          <p className="text-[11px] text-muted-foreground">Comparativo bruto / líquido</p>
          <div className="h-[320px] mt-4">
            <ResponsiveContainer>
              <BarChart data={monthSeries} margin={{ top: 8, right: 16, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} formatter={(value: any) => fmtBRL(Number(value))} />
                <Bar dataKey="bruto" fill="oklch(0.72 0.19 45)" radius={[8, 8, 0, 0]} name="Bruto" />
                <Bar dataKey="liquido" fill="oklch(0.55 0.22 295)" radius={[8, 8, 0, 0]} name="Líquido" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === "payroll" && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="h-1 w-full btn-primary-gradient" />
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-bold">Pagamento de Funcionários</h3>
            <p className="text-[11px] text-muted-foreground">Comissões acumuladas (não pagas)</p>
          </div>
          <div className="divide-y divide-border">
            {payroll.map((p) => (
              <div key={p.staff.id} className="p-4 flex items-center gap-4">
                {p.staff.avatarUrl ? (
                  <img src={p.staff.avatarUrl} alt="" className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {p.staff.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{p.staff.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {p.staff.role} · {p.staff.commissionRate}% comissão · {p.count} atendimento(s)
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase text-muted-foreground tracking-wide">Acumulado</p>
                  <p className="text-sm font-semibold text-foreground">{fmtBRL(p.totalComm)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase text-muted-foreground tracking-wide">A pagar</p>
                  <p className="text-base font-bold text-gradient">{fmtBRL(p.toPay)}</p>
                </div>
                <Button
                  disabled={p.toPay <= 0}
                  onClick={() => markPaid(p.unpaidIds, p.staff.name, p.toPay)}
                  className="btn-primary-gradient px-4 py-2 h-auto text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 size={13} /> Marcar Pago
                </Button>
              </div>
            ))}
            {payroll.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Nenhum funcionário cadastrado.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
