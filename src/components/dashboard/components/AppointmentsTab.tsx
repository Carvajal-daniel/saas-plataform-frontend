"use client";

import * as React from "react";
import {
  Plus, ChevronLeft, ChevronRight, Check, X as XIcon,
  Trash2, Clock, Scissors, Sparkles, Ban, AlertCircle,
  CalendarDays, User, DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/features/lib/utils";
import { Button } from "@/components/ui/Button";
import { Field, inputCls, Modal } from "./Modal";
import {
  fmtBRL, newId, useDashboard,
  type Appointment, type AppointmentStatus,
} from "../lib/dashboard-store";

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────── */

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];


const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

// Mapeamento semântico adaptivo (Fundo claro/colorido no Light e profundo no Dark)
const STATUS: Record<AppointmentStatus, {
  accent: string; 
  tagBg: string; tagText: string; tagBorder: string;
  cardBg: string; cardText: string; cardBorder: string; cardSubtext: string;
  chipBg: string; chipText: string; dot: string; label: string;
}> = {
  Marcado: {
    accent:    "bg-blue-500",
    tagBg:     "bg-blue-50 dark:bg-blue-950/60",
    tagText:   "text-blue-600 dark:text-blue-300",
    tagBorder: "border-blue-200 dark:border-blue-800",
    cardBg:    "bg-blue-50/50 dark:bg-zinc-900",
    cardText:  "text-blue-950 dark:text-white",
    cardBorder: "border-blue-100 dark:border-zinc-800 hover:dark:border-zinc-600",
    cardSubtext: "text-blue-700/80 dark:text-zinc-500",
    chipBg:    "bg-blue-100/60 dark:bg-blue-950/50",
    chipText:  "text-blue-700 dark:text-blue-300",
    dot:       "bg-blue-500",
    label:     "Marcado",
  },
  Concluído: {
    accent:    "bg-emerald-500",
    tagBg:     "bg-emerald-50 dark:bg-emerald-950/60",
    tagText:   "text-emerald-600 dark:text-emerald-300",
    tagBorder: "border-emerald-200 dark:border-emerald-800",
    cardBg:    "bg-emerald-50/50 dark:bg-zinc-900",
    cardText:  "text-emerald-950 dark:text-white",
    cardBorder: "border-emerald-100 dark:border-zinc-800 hover:dark:border-zinc-600",
    cardSubtext: "text-emerald-700/80 dark:text-zinc-500",
    chipBg:    "bg-emerald-100/60 dark:bg-emerald-950/50",
    chipText:  "text-emerald-700 dark:text-emerald-300",
    dot:       "bg-emerald-500",
    label:     "Concluído",
  },
  Cancelado: {
    accent:    "bg-red-500",
    tagBg:     "bg-red-50 dark:bg-red-950/60",
    tagText:   "text-red-600 dark:text-red-300",
    tagBorder: "border-red-200 dark:border-red-900",
    cardBg:    "bg-red-50/40 dark:bg-zinc-900",
    cardText:  "text-red-950 dark:text-white",
    cardBorder: "border-red-100 dark:border-zinc-800 hover:dark:border-zinc-600",
    cardSubtext: "text-red-700/80 dark:text-zinc-500",
    chipBg:    "bg-red-100/60 dark:bg-red-950/50",
    chipText:  "text-red-700 dark:text-red-300",
    dot:       "bg-red-500",
    label:     "Cancelado",
  },
};

function pad(n: number) { return String(n).padStart(2, "0"); }
function fmtDate(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}
function parseDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}
function isToday(y: number, m: number, d: number) {
  const t = new Date();
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
}
function isPast(s: string) {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return new Date(s + "T00:00:00") < t;
}
function generateSlots(open = "08:00", close = "20:00") {
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const slots: string[] = [];
  for (let min = oh * 60 + om; min <= ch * 60 + cm; min += 30) {
    slots.push(`${pad(Math.floor(min / 60))}:${pad(min % 60)}`);
  }
  return slots;
}

function groupByDay(appts: Appointment[]) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  const fmt = (d: Date) => fmtDate(d.getFullYear(), d.getMonth(), d.getDate());

  const groups: Record<string, { label: string; appts: Appointment[] }> = {};
  const order: string[] = [];

  [...appts]
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .map((a) => {
      if (!groups[a.date]) {
        let label = a.date;
        if (a.date === fmt(today)) label = "Hoje";
        else if (a.date === fmt(tomorrow)) label = "Amanhã";
        else if (a.date === fmt(yesterday)) label = "Ontem";
        else {
          const { day, month } = parseDate(a.date);
          label = `${day} de ${MONTHS[month]}`;
        }
        groups[a.date] = { label, appts: [] };
        order.push(a.date);
      }
      groups[a.date].appts.push(a);
    });

  return order.map((k) => groups[k]);
}

/* ─────────────────────────────────────────────────────────────────────────
   STATUS TAG
───────────────────────────────────────────────────────────────────────── */

function Tag({ status }: { status: AppointmentStatus }) {
  const s = STATUS[status];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border",
      s.tagBg, s.tagText, s.tagBorder,
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   APPOINTMENT CARD ROW
───────────────────────────────────────────────────────────────────────── */

function ApptCard({ appt, onClick }: { appt: Appointment; onClick: () => void }) {
  const s = STATUS[appt.status];
  const { day, month } = parseDate(appt.date);
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-stretch border rounded-xl overflow-hidden transition-all duration-150",
        s.cardBg, s.cardBorder,
        appt.status === "Cancelado" && "opacity-60",
      )}
    >
      {/* accent bar */}
      <div className={cn("w-[3px] shrink-0", s.accent)} />

      {/* time */}
      <div className="flex flex-col items-center justify-center px-4 py-3 border-r border-inherit min-w-[60px]">
        <span className={cn("text-sm font-semibold tabular-nums leading-none", s.cardText)}>{appt.time}</span>
        <span className={cn("text-[10px] mt-1 font-medium", s.cardSubtext)}>{day}/{month + 1}</span>
      </div>

      {/* info */}
      <div className="flex-1 min-w-0 px-4 py-3">
        <p className={cn(
          "text-sm font-semibold truncate",
          s.cardText,
          appt.status === "Cancelado" && "line-through opacity-60",
        )}>
          {appt.client}
        </p>
        <p className={cn("text-xs truncate mt-0.5 font-medium", s.cardSubtext)}>
          {appt.service} · {appt.staff}
        </p>
      </div>

      {/* price + tag */}
      <div className="flex flex-col items-end justify-center px-4 py-3 shrink-0">
        <span className={cn("text-sm font-semibold tabular-nums", s.cardText)}>{fmtBRL(appt.price)}</span>
        <span className="mt-1.5"><Tag status={appt.status} /></span>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   DETAIL MODAL
───────────────────────────────────────────────────────────────────────── */

function DetailModal({ open, onClose, appt, onSetStatus, onDelete }: {
  open: boolean; onClose: () => void; appt: Appointment | null;
  onSetStatus: (id: string, s: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}) {
  if (!appt) return null;
  const { day, month, year } = parseDate(appt.date);
  const s = STATUS[appt.status];

  return (
    <Modal open={open} onClose={onClose} title="Detalhes do agendamento">
      <div className="space-y-4 min-w-[320px]">
        {/* header card */}
        <div className={cn("rounded-xl border overflow-hidden", s.tagBorder)}>
          <div className={cn("px-4 py-3 flex items-start justify-between", s.tagBg)}>
            <div>
              <p className="text-base font-semibold text-zinc-900 dark:text-white">{appt.client}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{appt.service}</p>
            </div>
            <Tag status={appt.status} />
          </div>
          <div className="grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800">
            {[
              { label: "Horário", value: appt.time },
              { label: "Profissional", value: appt.staff },
              { label: "Data", value: `${day}/${month + 1}/${year}` },
              { label: "Valor", value: fmtBRL(appt.price) },
            ].map((f) => (
              <div key={f.label} className="bg-white dark:bg-zinc-900 p-3">
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">{f.label}</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* actions */}
        {appt.status !== "Concluído" && (
          <div className={cn("grid gap-2", appt.status === "Cancelado" ? "grid-cols-1" : "grid-cols-2")}>
            <Button
              onClick={() => { onSetStatus(appt.id, "Concluído"); onClose(); }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 text-sm font-medium border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition-colors"
            >
              <Check size={14} /> Marcar concluído
            </Button>
            {appt.status === "Marcado" && (
              <Button
                onClick={() => { onSetStatus(appt.id, "Cancelado"); onClose(); }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 text-sm font-medium border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
              >
                <XIcon size={14} /> Cancelar
              </Button>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => { onDelete(appt.id); onClose(); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 dark:hover:border-red-900 transition-all"
        >
          <Trash2 size={13} /> Excluir agendamento
        </Button>
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   BOOKING WIZARD MODAL
───────────────────────────────────────────────────────────────────────── */

function BookingModal({ open, onClose, preDate, onSave, existing }: {
  open: boolean; onClose: () => void; preDate?: string;
  onSave: (a: Omit<Appointment, "id">) => void; existing: Appointment[];
}) {
  const { services, staff, business } = useDashboard();
  const [step, setStep] = React.useState(1);
  const [serviceId, setServiceId] = React.useState("");
  const [staffId, setStaffId] = React.useState("");
  const [date, setDate] = React.useState(preDate ?? "");
  const [time, setTime] = React.useState("");
  const [client, setClient] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setStep(1); setServiceId(""); setStaffId("");
      setDate(preDate ?? ""); setTime(""); setClient(""); setNotes("");
    }
  }, [open, preDate]);

  const selService = services.find((s) => s.id === serviceId);
  const selStaff = staff.find((s) => s.id === staffId);
  const activeStaff = staff.filter((s) => s.status === "Ativo");

  const dateWD = date ? new Date(date + "T00:00:00").getDay() : -1;
  const bizClosed = date ? business.closedDays.includes(dateWD) : false;
  const staffOff = !!(selStaff && date && selStaff.daysOff.includes(dateWD));

  const slots = React.useMemo(() => generateSlots(business.openTime, business.closeTime), [business]);
  const booked = React.useMemo(() => {
    if (!staffId || !date || !selStaff) return new Set<string>();
    return new Set(
      existing
        .filter((a) => a.staff === selStaff.name && a.date === date && a.status !== "Cancelado")
        .map((a) => a.time),
    );
  }, [staffId, date, existing, selStaff]);

  const canNext = () => {
    if (step === 1) return !!serviceId;
    if (step === 2) return !!staffId && !!date && !bizClosed && !staffOff;
    if (step === 3) return !!time;
    return false;
  };

  const save = () => {
    if (!client.trim() || !selService || !selStaff || !date || !time) return;
    onSave({ client: client.trim(), service: selService.name, staff: selStaff.name, date, time, status: "Marcado", price: selService.price, notes });
  };

  const stepLabels = ["Serviço", "Profissional", "Horário", "Cliente"];

  return (
    <Modal
      open={open} onClose={onClose} title="Novo agendamento"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost"
            onClick={() => step > 1 ? setStep((s) => s - 1) : onClose()}
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white px-3 py-2 rounded-xl">
            {step === 1 ? "Cancelar" : "← Voltar"}
          </Button>
          {step < 4 ? (
            <Button onClick={() => canNext() && setStep((s) => s + 1)} disabled={!canNext()}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-30 hover:bg-blue-500 transition-colors">
              Próximo →
            </Button>
          ) : (
            <Button onClick={save} disabled={!client.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium disabled:opacity-30 hover:bg-blue-500 transition-colors">
              Confirmar
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-5 min-w-[360px]">
        {/* steps */}
        <div className="flex items-center">
          {stepLabels.map((label, i) => {
            const n = i + 1; const active = n === step; const done = n < step;
            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium border-2 transition-all",
                    done ? "bg-blue-600 border-transparent text-white"
                      : active ? "border-blue-500 text-blue-500 dark:text-blue-400"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600",
                  )}>
                    {done ? <Check size={11} /> : n}
                  </div>
                  <span className={cn("text-[10px] font-medium whitespace-nowrap",
                    active ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-600")}>{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={cn("flex-1 h-px mb-5 mx-1", done ? "bg-blue-600/50" : "bg-zinc-200 dark:bg-zinc-800")} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* step 1 — serviço */}
        {step === 1 && (
          <div className="space-y-2 max-h-96 overflow-auto pr-1">
            {services.length === 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
                <AlertCircle size={14} /> Cadastre serviços em Gestão.
              </div>
            )}
            {services.map((svc) => (
              <button key={svc.id} onClick={() => setServiceId(svc.id)}
                className={cn(
                  "w-full text-left rounded-xl p-3.5 border-2 transition-all flex items-center gap-3",
                  serviceId === svc.id ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/40" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600",
                )}>
                {svc.imageUrl
                  ? <img src={svc.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  : <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><Scissors size={14} className="text-zinc-400 dark:text-zinc-500" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900 dark:text-white text-sm">{svc.name}</p>
                  {svc.description && <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{svc.description}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-sm text-zinc-900 dark:text-white">{fmtBRL(svc.price)}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">{svc.duration} min</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* step 2 — profissional & data */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-2">Profissional</p>
              {activeStaff.length === 0 && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
                  <AlertCircle size={14} /> Nenhum profissional ativo.
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {activeStaff.map((s) => (
                  <button key={s.id} onClick={() => setStaffId(s.id)}
                    className={cn(
                      "flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all",
                      staffId === s.id ? "border-blue-600 bg-blue-50/30 dark:bg-blue-950/40" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600",
                    )}>
                    {s.avatarUrl
                      ? <img src={s.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                      : <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
                          {s.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </div>}
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate text-zinc-900 dark:text-white">{s.name}</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{s.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Field label="Data">
              <input type="date" className={inputCls} value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => { setDate(e.target.value); setTime(""); }} />
            </Field>
            {bizClosed && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2 flex items-center gap-2">
                <Ban size={13} /> O estabelecimento não funciona neste dia.
              </p>
            )}
            {staffOff && (
              <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 flex items-center gap-2">
                <AlertCircle size={13} /> {selStaff?.name} não trabalha neste dia.
              </p>
            )}
          </div>
        )}

        {/* step 3 — horário */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Horários disponíveis</p>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">{slots.length - booked.size} livres</span>
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
              {slots.map((slot) => {
                const taken = booked.has(slot);
                return (
                  <button key={slot} disabled={taken} onClick={() => setTime(slot)}
                    className={cn(
                      "py-2 rounded-lg text-xs font-medium border-2 transition-all",
                      taken ? "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 text-zinc-300 dark:text-zinc-700 cursor-not-allowed line-through"
                        : time === slot ? "border-blue-600 bg-blue-600 text-white"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:border-zinc-300 dark:hover:border-zinc-600",
                    )}>
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* step 4 — cliente */}
        {step === 4 && (
          <div className="space-y-3">
            <Field label="Nome do cliente *">
              <input className={inputCls} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Ex: Maria Silva" autoFocus />
            </Field>
            <Field label="Observações (opcional)">
              <textarea className={cn(inputCls, "min-h-[80px] resize-none")} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alergias, preferências…" rows={2} />
            </Field>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Resumo</p>
              </div>
              <div className="p-4 space-y-2.5">
                {[
                  { icon: <Scissors size={12} />, label: "Serviço", value: selService?.name ?? "" },
                  { icon: <User size={12} />, label: "Profissional", value: selStaff?.name ?? "" },
                  { icon: <CalendarDays size={12} />, label: "Data", value: date ? (() => { const { day, month, year } = parseDate(date); return `${day} de ${MONTHS[month]} de ${year}`; })() : "" },
                  { icon: <Clock size={12} />, label: "Horário", value: time },
                  { icon: <DollarSign size={12} />, label: "Valor", value: fmtBRL(selService?.price ?? 0) },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <span className="text-zinc-400 dark:text-zinc-500 w-4 flex items-center justify-center">{icon}</span>
                    <span className="text-zinc-400 dark:text-zinc-500 w-24 text-xs">{label}</span>
                    <span className="font-medium text-zinc-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CALENDAR CELL
───────────────────────────────────────────────────────────────────────── */

function CalCell({
  day, dateStr, todayFlag, pastFlag, closed, dayAppts, activeCount, onClick,
}: {
  day: number; dateStr: string; todayFlag: boolean; pastFlag: boolean;
  closed: boolean; dayAppts: Appointment[]; activeCount: number; onClick: () => void;
}) {
  const allDone = dayAppts.length > 0 && dayAppts.every((a) => a.status === "Concluído");

  return (
    <button
      disabled={closed}
      onClick={onClick}
      className={cn(
        "min-h-[80px] p-2 text-left flex flex-col gap-1 transition-colors focus:outline-none w-full",
        closed ? "bg-zinc-100 dark:bg-zinc-950/60 cursor-not-allowed"
          : todayFlag ? "bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-50/70 dark:hover:bg-blue-950/50"
          : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
      )}
    >
      <div className="flex items-center justify-between w-full">
        <span className={cn(
          "w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium",
          todayFlag ? "bg-blue-500 text-white"
            : pastFlag || closed ? "text-zinc-400 dark:text-zinc-700"
            : "text-zinc-700 dark:text-zinc-300",
        )}>
          {day}
        </span>
        {activeCount > 0 && (
          <span className={cn(
            "text-[9px] font-semibold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center text-white",
            allDone ? "bg-emerald-500" : "bg-blue-500",
          )}>
            {activeCount}
          </span>
        )}
      </div>

      {closed ? (
        <span className="text-[9px] text-red-500 flex items-center gap-1 mt-auto font-medium">
          <Ban size={9} /> Fechado
        </span>
      ) : (
        <div className="flex flex-col gap-0.5 overflow-hidden w-full mt-auto">
          {dayAppts.slice(0, 2).map((appt) => {
            const s = STATUS[appt.status];
            return (
              <div key={appt.id} className={cn(
                "w-full rounded px-1.5 py-px text-[9px] font-medium truncate border",
                s.chipBg, s.chipText, s.tagBorder,
                appt.status === "Cancelado" && "line-through opacity-50",
              )}>
                <span className="tabular-nums mr-1 opacity-60">{appt.time}</span>
                {appt.client}
              </div>
            );
          })}
          {dayAppts.length > 2 && (
            <span className="text-[9px] text-zinc-400 dark:text-zinc-600 pl-1 font-medium">+{dayAppts.length - 2} mais</span>
          )}
        </div>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────────────────────── */

type View = "lista" | "calendario";

export function AppointmentsTab() {
  const {
    appointments, setAppointments, staff, business,
    pushNotification, focusedAppointmentId, setFocusedAppointmentId, search,
  } = useDashboard();

  /* ── mutations ── */
  const add = (a: Omit<Appointment, "id">) => {
    const id = newId();
    setAppointments((arr) => [...arr, { ...a, id }]);
    pushNotification({
      text: `Novo agendamento: ${a.client} — ${a.service}`,
      type: "appointment",
      targetId: id,
    });
    toast.success(`Agendamento de ${a.client} criado com sucesso!`);
  };

  const update = (id: string, patch: Partial<Appointment>) => {
    setAppointments((arr) =>
      arr.map((a) => {
        if (a.id !== id) return a;
        const next = { ...a, ...patch };

        if (patch.status === "Concluído" && a.status !== "Concluído") {
          const member = staff.find((s) => s.name === a.staff);
          next.commissionEarned = +(a.price * (member ? member.commissionRate / 100 : 0)).toFixed(2);

          pushNotification({
            text: `Concluído: ${a.client} — ${fmtBRL(a.price)}`,
            type: "financial",
            targetId: id,
          });
          toast.success(`${a.client} marcado como concluído.`);
        }

        if (patch.status === "Cancelado" && a.status !== "Cancelado") {
          toast.error(`Agendamento de ${a.client} cancelado.`);
        }

        if (patch.status && patch.status !== "Concluído") {
          next.commissionEarned = 0;
        }

        return next;
      })
    );
  };

  const del = (id: string) => {
    const appt = appointments.find((a) => a.id === id);
    setAppointments((arr) => arr.filter((a) => a.id !== id));
    toast.error(`Agendamento de ${appt?.client ?? "cliente"} removido.`);
  };

  /* ── state ── */
  const [view, setView] = React.useState<View>("lista");
  const [calYear, setCalYear] = React.useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = React.useState(() => new Date().getMonth());
  const [dayModal, setDayModal] = React.useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [bookingDate, setBookingDate] = React.useState<string | undefined>();
  const [detailAppt, setDetailAppt] = React.useState<Appointment | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  React.useEffect(() => {
    if (!focusedAppointmentId) return;
    const a = appointments.find((x) => x.id === focusedAppointmentId);
    if (a) { setDetailAppt(a); setDetailOpen(true); setFocusedAppointmentId(null); }
  }, [focusedAppointmentId, appointments, setFocusedAppointmentId]);

  /* ── filtered ── */
  const filtered = React.useMemo(() => {
    const val = search.toLowerCase();
    return appointments.filter((a) =>
      a.client.toLowerCase().includes(val) ||
      a.service.toLowerCase().includes(val) ||
      a.staff.toLowerCase().includes(val),
    );
  }, [appointments, search]);

  const marcados   = filtered.filter((a) => a.status === "Marcado");
  const concluidos = filtered.filter((a) => a.status === "Concluído");
  const cancelados = filtered.filter((a) => a.status === "Cancelado");

  /* ── revenue today ── */
  const todayStr = fmtDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const revenueToday = appointments
    .filter((a) => a.date === todayStr && a.status === "Concluído")
    .reduce((sum, a) => sum + a.price, 0);

  /* ── grouped list ── */
  const groups = React.useMemo(() => groupByDay(filtered), [filtered]);

  /* ── calendar ── */
  const allByDate = React.useMemo(() => {
    const m: Record<string, Appointment[]> = {};
    appointments.forEach((a) => { (m[a.date] ??= []).push(a); });
    return m;
  }, [appointments]);

  const filteredByDate = React.useMemo(() => {
    const m: Record<string, Appointment[]> = {};
    filtered.forEach((a) => { (m[a.date] ??= []).push(a); });
    return m;
  }, [filtered]);

  const prevMonth = () => calMonth === 0 ? (setCalMonth(11), setCalYear((y) => y - 1)) : setCalMonth((m) => m - 1);
  const nextMonth = () => calMonth === 11 ? (setCalMonth(0), setCalYear((y) => y + 1)) : setCalMonth((m) => m + 1);
  const goToday   = () => { setCalYear(new Date().getFullYear()); setCalMonth(new Date().getMonth()); };

  const openBooking = (d?: string) => { setBookingDate(d); setBookingOpen(true); };
  const handleSave  = (a: Omit<Appointment, "id">) => { add(a); setBookingOpen(false); setDayModal(null); };
  const openDetail  = (a: Appointment) => { setDetailAppt(a); setDetailOpen(true); };

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  return (
    <div className="space-y-5 p-1 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white transition-colors duration-150">

      {/* ── top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Agenda</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {appointments.length} agendamentos · {marcados.length} pendentes
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 gap-1">
            {(["lista", "calendario"] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                  view === v ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300",
                )}>
                {v === "lista" ? "Lista" : "Calendário"}
              </button>
            ))}
          </div>
          <Button
            onClick={() => openBooking()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors shadow-sm"
          >
            <Plus size={15} /> Novo
          </Button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Marcados",   value: marcados.length,   color: "text-blue-600 dark:text-blue-400" },
          { label: "Concluídos", value: concluidos.length, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Cancelados", value: cancelados.length, color: "text-red-600 dark:text-red-400" },
          { label: "Receita hoje", value: fmtBRL(revenueToday), color: "text-green-800/90 dark:text-green-700  font-bold" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 shadow-2xs">
            <p className={cn("text-2xl font-bold tabular-nums leading-none", color)}>{value}</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 font-medium uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* ── LISTA ── */}
      {view === "lista" && (
        <div className="space-y-6">
          {filtered.length === 0 && (
            <div className="py-16 flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600">
              <Sparkles size={24} className="opacity-40" />
              <p className="text-sm">Nenhum agendamento encontrado.</p>
            </div>
          )}
          {groups.map((group) => (
            <div key={group.label} className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="space-y-2">
                {group.appts.map((a) => (
                  <ApptCard key={a.id} appt={a} onClick={() => openDetail(a)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CALENDÁRIO ── */}
      {view === "calendario" && (
        <>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {MONTHS[calMonth]} <span className="text-zinc-400 dark:text-zinc-500 font-normal">{calYear}</span>
              </h3>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                  <ChevronLeft size={15} />
                </button>
                <button onClick={goToday}
                  className="px-3 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                  Hoje
                </button>
                <button onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 bg-zinc-50/50 dark:bg-zinc-950/40 border-b border-zinc-100 dark:border-zinc-800">
              {WEEKDAYS.map((d, i) => (
                <div key={d} className={cn(
                  "py-2.5 text-center text-[10px] font-bold uppercase tracking-widest",
                  business.closedDays.includes(i) ? "text-rose-500" : "text-zinc-400 dark:text-zinc-500",
                )}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 divide-x divide-zinc-100 dark:divide-zinc-800 bg-zinc-200 dark:bg-zinc-800 gap-px">
              {weeks.map((week, wi) => (
                <React.Fragment key={wi}>
                  {week.map((day, di) => {
                    if (!day) return <div key={di} className="min-h-[80px] bg-zinc-50/30 dark:bg-zinc-950/20" />;
                    const dateStr = fmtDate(calYear, calMonth, day);
                    const wd = new Date(dateStr + "T00:00:00").getDay();
                    const closed = business.closedDays.includes(wd);
                    const dayAppts = filteredByDate[dateStr] ?? [];
                    const activeCount = (allByDate[dateStr] ?? []).filter((a) => a.status !== "Cancelado").length;
                    return (
                      <CalCell key={di}
                        day={day} dateStr={dateStr}
                        todayFlag={isToday(calYear, calMonth, day)}
                        pastFlag={isPast(dateStr)}
                        closed={closed}
                        dayAppts={dayAppts}
                        activeCount={activeCount}
                        onClick={() => setDayModal(dateStr)}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex gap-4 px-1">
            {(["Marcado", "Concluído", "Cancelado"] as AppointmentStatus[]).map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full", STATUS[s].dot)} />
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">{s}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── DAY PANEL MODAL ── */}
      <Modal
        open={!!dayModal}
        onClose={() => setDayModal(null)}
        title={dayModal ? (() => { const { day, month, year } = parseDate(dayModal); return `${day} de ${MONTHS[month]} de ${year}`; })() : ""}
      >
        <div className="space-y-2 min-w-[320px]">
          {dayModal && (allByDate[dayModal] ?? []).length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-2 text-zinc-400">
              <Sparkles size={20} className="opacity-40" />
              <p className="text-sm">Dia livre — sem agendamentos.</p>
            </div>
          ) : (
            dayModal &&
            [...(allByDate[dayModal] ?? [])]
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appt) => (
                <ApptCard key={appt.id} appt={appt} onClick={() => { setDayModal(null); openDetail(appt); }} />
              ))
          )}
          {dayModal && !isPast(dayModal) && !business.closedDays.includes(new Date(dayModal + "T00:00:00").getDay()) && (
            <button
              onClick={() => { const d = dayModal; setDayModal(null); openBooking(d ?? undefined); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all bg-white dark:bg-zinc-900"
            >
              <Plus size={14} /> Novo agendamento neste dia
            </button>
          )}
        </div>
      </Modal>

      <DetailModal
        open={detailOpen} onClose={() => setDetailOpen(false)} appt={detailAppt}
        onSetStatus={(id, st) => { update(id, { status: st }); setDetailAppt((a) => a ? { ...a, status: st } : a); }}
        onDelete={del}
      />

      <BookingModal
        open={bookingOpen} onClose={() => setBookingOpen(false)}
        preDate={bookingDate} onSave={handleSave} existing={appointments}
      />
    </div>
  );
}