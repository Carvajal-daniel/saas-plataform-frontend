"use client";

import * as React from "react";
import {
  Plus, Trash2, Check, X as XIcon, ChevronLeft, ChevronRight,
  Clock, User, Scissors, Sparkles, CalendarDays, DollarSign, AlertCircle, Ban,
} from "lucide-react";
import { Field, inputCls, Modal } from "./Modal";
import { toast } from "sonner";
import { fmtBRL, newId, useDashboard, type Appointment, type AppointmentStatus } from "../lib/dashboard-store";
import { cn } from "@/features/lib/utils";
import { Button } from "@/components/ui/Button";

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
═══════════════════════════════════════════════════════════════════════════ */

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const WEEKDAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

// Função utilitária para gerar os slots com base na configuração dinâmica de horários
function generateSlots(openTime: string = "08:00", closeTime: string = "20:00") {
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  
  const startMin = openH * 60 + openM;
  const endMin = closeH * 60 + closeM;
  
  const slots: string[] = [];
  for (let min = startMin; min <= endMin; min += 30) {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
}

const statusStyles: Record<AppointmentStatus, { dot: string; chip: string; chipText: string; border: string; calBg: string; calText: string; label: string }> = {
  Marcado:   { dot: "bg-sky-400",   chip: "bg-sky-500/10 border-sky-500/30",   chipText: "text-sky-600 dark:text-sky-300",        border: "border-sky-500/40",     calBg: "bg-sky-500/5",     calText: "text-sky-600 dark:text-sky-300",        label: "Marcado"   },
  Concluído: { dot: "bg-emerald-400", chip: "bg-emerald-500/10 border-emerald-500/30", chipText: "text-emerald-600 dark:text-emerald-300", border: "border-emerald-500/40", calBg: "bg-emerald-500/5", calText: "text-emerald-600 dark:text-emerald-300", label: "Concluído" },
  Cancelado: { dot: "bg-rose-400",    chip: "bg-rose-500/10 border-rose-500/30",   chipText: "text-rose-600 dark:text-rose-300",      border: "border-rose-500/30",    calBg: "bg-rose-500/5",    calText: "text-rose-600 dark:text-rose-300",      label: "Cancelado" },
};

const statusFilters: { key: "Todos" | AppointmentStatus; label: string }[] = [
  { key: "Todos",     label: "Todos"      },
  { key: "Marcado",   label: "Marcados"   },
  { key: "Concluído", label: "Concluídos" },
  { key: "Cancelado", label: "Cancelados" },
];

const fmtDate = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const parseDate = (s: string) => { const [y, m, d] = s.split("-").map(Number); return { year: y, month: m - 1, day: d }; };
const isToday = (y: number, m: number, d: number) => { const t = new Date(); return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d; };
const isPast = (s: string) => { const t = new Date(); t.setHours(0, 0, 0, 0); return new Date(s + "T00:00:00") < t; };

/* ═══════════════════════════════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const s = statusStyles[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border", s.chip, s.chipText)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BOOKING WIZARD MODAL
═══════════════════════════════════════════════════════════════════════════ */

interface BookingProps {
  open: boolean; onClose: () => void; preDate?: string;
  onSave: (a: Omit<Appointment, "id">) => void;
  existing: Appointment[];
}

function BookingModal({ open, onClose, preDate, onSave, existing }: BookingProps) {
  const { services, staff, business } = useDashboard();
  const [step, setStep] = React.useState(1);
  const [serviceId, setServiceId] = React.useState("");
  const [staffId, setStaffId] = React.useState("");
  const [date, setDate] = React.useState(preDate ?? "");
  const [time, setTime] = React.useState("");
  const [client, setClient] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (open) { setStep(1); setServiceId(""); setStaffId(""); setDate(preDate ?? ""); setTime(""); setClient(""); setNotes(""); }
  }, [open, preDate]);

  const selService = services.find((s) => s.id === serviceId);
  const selStaff = staff.find((s) => s.id === staffId);
  const availableStaff = staff.filter((s) => s.status === "Ativo");

  const dateWeekday = date ? new Date(date + "T00:00:00").getDay() : -1;
  const businessClosed = date ? business.closedDays.includes(dateWeekday) : false;
  const staffOff = !!(selStaff && date && selStaff.daysOff.includes(dateWeekday));

  // Geração dos horários permitidos pelo painel administrativo
  const slots = React.useMemo(() => {
    return generateSlots(business.openTime, business.closeTime);
  }, [business.openTime, business.closeTime]);

  const booked = React.useMemo(() => {
    if (!staffId || !date || !selStaff) return new Set<string>();
    return new Set(existing.filter((a) => a.staff === selStaff.name && a.date === date && a.status !== "Cancelado").map((a) => a.time));
  }, [staffId, date, existing, selStaff]);

  const canNext = () => {
    if (step === 1) return !!serviceId;
    if (step === 2) return !!staffId && !!date && !businessClosed && !staffOff;
    if (step === 3) return !!time;
    return false;
  };

  const save = () => {
    if (!client.trim() || !selService || !selStaff || !date || !time) return;
    onSave({ client: client.trim(), service: selService.name, staff: selStaff.name, date, time, status: "Marcado", price: selService.price, notes });
  };

  const labels = ["Serviço", "Profissional & Data", "Horário", "Cliente"];

  return (
    <Modal open={open} onClose={onClose} title="Novo Agendamento"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" onClick={() => (step > 1 ? setStep((s) => s - 1) : onClose())} className="rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground">
            {step === 1 ? "Cancelar" : "← Voltar"}
          </Button>
          {step < 4 ? (
            <Button onClick={() => canNext() && setStep((s) => s + 1)} disabled={!canNext()} className="btn-primary-gradient px-5 py-2 rounded-xl text-sm font-semibold text-white">
              Próximo →
            </Button>
          ) : (
            <Button onClick={save} disabled={!client.trim()} className="btn-primary-gradient px-5 py-2 rounded-xl text-sm font-semibold text-white">
              Confirmar
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-5 min-w-[360px]">
        <div className="flex items-center gap-0">
          {labels.map((l, i) => {
            const n = i + 1; const active = n === step; const done = n < step;
            return (
              <React.Fragment key={l}>
                <div className="flex flex-col items-center gap-1">
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all", done ? "btn-primary-gradient border-transparent text-white" : active ? "border-primary text-primary bg-primary/10 ring-2 ring-primary/30" : "border-border text-muted-foreground")}>
                    {done ? <Check size={12} /> : n}
                  </div>
                  <span className={cn("text-[10px] font-medium whitespace-nowrap", active ? "text-foreground" : "text-muted-foreground")}>{l}</span>
                </div>
                {i < labels.length - 1 && <div className={cn("flex-1 h-0.5 mb-4 mx-1 transition-all", done ? "bg-primary/60" : "bg-border")} />}
              </React.Fragment>
            );
          })}
        </div>

        {step === 1 && (
          <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
            {services.length === 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
                <AlertCircle size={14} /> Cadastre serviços em Gestão.
              </div>
            )}
            {services.map((svc) => (
              <button key={svc.id} onClick={() => setServiceId(svc.id)} className={cn("w-full text-left rounded-xl p-3.5 border-2 transition-all hover:-translate-y-0.5 flex items-center gap-3", serviceId === svc.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40")}>
                {svc.imageUrl ? <img src={svc.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"><Scissors size={16} className="text-muted-foreground" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{svc.name}</p>
                  {svc.description && <p className="text-xs text-muted-foreground truncate">{svc.description}</p>}
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="font-bold text-sm text-foreground">{fmtBRL(svc.price)}</p>
                  <p className="text-xs text-muted-foreground">{svc.duration} min</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Profissional</p>
              {availableStaff.length === 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
                  <AlertCircle size={14} /> Nenhum profissional ativo.
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {availableStaff.map((s) => (
                  <button key={s.id} onClick={() => setStaffId(s.id)} className={cn("flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all", staffId === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 bg-card")}>
                    {s.avatarUrl ? <img src={s.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{s.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-foreground">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{s.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Field label="Data">
              <input type="date" className={inputCls} value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => { setDate(e.target.value); setTime(""); }} />
            </Field>
            {businessClosed && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                <Ban size={13} /> O estabelecimento não funciona neste dia.
              </div>
            )}
            {staffOff && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle size={13} /> {selStaff?.name} não trabalha neste dia da semana.
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Horários</p>
              <span className="text-xs text-muted-foreground">{slots.length - booked.size} disponíveis</span>
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
              {slots.map((slot) => {
                const isBooked = booked.has(slot);
                return (
                  <button key={slot} disabled={isBooked} onClick={() => setTime(slot)} className={cn("py-2 rounded-xl text-xs font-semibold border-2 transition-all", isBooked ? "border-border bg-muted text-muted-foreground/40 cursor-not-allowed line-through" : time === slot ? "btn-primary-gradient border-transparent text-white shadow-md scale-105" : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-primary/5")}>
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <Field label="Nome do Cliente *">
              <input className={inputCls} value={client} onChange={(e) => setClient(e.target.value)} placeholder="Ex: Maria Silva" autoFocus />
            </Field>
            <Field label="Observações (opcional)">
              <textarea className={cn(inputCls, "min-h-[80px]")} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alergias, preferences…" rows={2} />
            </Field>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="h-1 w-full btn-primary-gradient" />
              <div className="p-4 space-y-2.5 bg-card text-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resumo</p>
                {[
                  { icon: <Scissors size={12} />, label: "Serviço", value: selService?.name ?? "" },
                  { icon: <User size={12} />, label: "Profissional", value: selStaff?.name ?? "" },
                  { icon: <CalendarDays size={12} className="text-sky-500 dark:text-sky-400" />, label: "Data", value: date ? (() => { const { day, month, year } = parseDate(date); return `${day} de ${MONTHS[month]} de ${year}`; })() : "" },
                  { icon: <Clock size={12} />, label: "Horário", value: time },
                  { icon: <DollarSign size={12} />, label: "Valor", value: fmtBRL(selService?.price ?? 0) },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    <span className="w-4 flex items-center justify-center">{icon}</span>
                    <span className="text-muted-foreground w-24 text-xs">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
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

/* ═══════════════════════════════════════════════════════════════════════════
   DETAIL MODAL — VER / ALTERAR STATUS / EXCLUIR
═══════════════════════════════════════════════════════════════════════════ */

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  appt: Appointment | null;
  onSetStatus: (id: string, s: AppointmentStatus) => void;
  onDelete: (id: string) => void;
}

function DetailModal({ open, onClose, appt, onSetStatus, onDelete }: DetailModalProps) {
  if (!appt) return null;
  const { day, month, year } = parseDate(appt.date);
  const s = statusStyles[appt.status];
  return (
    <Modal open={open} onClose={onClose} title="Detalhes do Agendamento">
      <div className="space-y-4 min-w-[340px]">
        <div className={cn("rounded-2xl border-2 overflow-hidden", s.border)}>
          <div className={cn("px-4 py-3 flex items-center justify-between", s.calBg)}>
            <div>
              <p className="text-base font-bold text-foreground">{appt.client}</p>
              <p className="text-xs text-muted-foreground">{appt.service}</p>
            </div>
            <StatusBadge status={appt.status} />
          </div>
          <div className="p-4 bg-card grid grid-cols-2 gap-3">
            {[
              { icon: <Clock size={12} />, label: "Horário", value: appt.time },
              { icon: <User size={12} />, label: "Profissional", value: appt.staff },
              { icon: <CalendarDays size={12} className={s.calText} />, label: "Data", value: `${day}/${month + 1}/${year}` },
              { icon: <DollarSign size={12}  />, label: "Valor", value: fmtBRL(appt.price) },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-muted/50 p-2.5">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest mb-1">
                  <span className="text-muted-foreground flex items-center">{f.icon}</span>
                  <span className="text-muted-foreground">{f.label}</span>
                </span>
                <span className="text-sm font-semibold text-foreground">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
        {appt.status !== "Concluído" && (
          <div className={cn("grid gap-2", appt.status === "Cancelado" ? "grid-cols-1" : "grid-cols-2")}>
            <Button onClick={() => { onSetStatus(appt.id, "Concluído"); onClose(); }} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-sm font-semibold border border-emerald-500/30 hover:bg-emerald-500/20">
              <Check size={14} /> Marcar Concluído
            </Button>
            {appt.status === "Marcado" && (
              <Button onClick={() => { onSetStatus(appt.id, "Cancelado"); onClose(); }} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-300 text-sm font-semibold border border-rose-500/30 hover:bg-rose-500/20">
                <XIcon size={14} /> Cancelar
              </Button>
            )}
          </div>
        )}
        <Button variant="ghost" onClick={() => { onDelete(appt.id); onClose(); }} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all">
          <Trash2 size={13} /> Excluir agendamento
        </Button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export function AppointmentsTab() {
  const { appointments, setAppointments, staff, business, pushNotification, focusedAppointmentId, setFocusedAppointmentId,  search, } = useDashboard();

  const add = (a: Omit<Appointment, "id">) => {
    const id = newId();
    setAppointments((arr) => [...arr, { ...a, id }]);
    pushNotification({
      text: `Novo agendamento: ${a.client} — ${a.service}`,
      type: "appointment",
      targetId: id,
    });
    toast.success(`Agendamento de ${a.client} criado com sucesso!`, { id: `created-${id}` });
  };

  const update = (id: string, patch: Partial<Appointment>) => {
    setAppointments((arr) =>
      arr.map((a) => {
        if (a.id !== id) return a;
        const next = { ...a, ...patch };

        if (patch.status === "Concluído" && a.status !== "Concluído") {
          const member = staff.find((s) => s.name === a.staff);
          const rate = member ? member.commissionRate / 100 : 0;
          next.commissionEarned = +(a.price * rate).toFixed(2);

          pushNotification({
            text: `Atendimento concluído: ${a.client} — ${fmtBRL(a.price)}`,
            type: "financial",
            targetId: id,
          });
          toast.success(`Agendamento de ${a.client} marcado como concluído.`, { id: `completed-${id}` });
        }

        if (patch.status === "Cancelado" && a.status !== "Cancelado") {
          toast.error(`Agendamento de ${a.client} foi cancelado.`);
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
    toast.error(`Agendamento de ${appt?.client ?? "cliente"} foi removido.`);
  };

  const [filter, setFilter] = React.useState<"Todos" | AppointmentStatus>("Todos");
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

 const filtered = React.useMemo(() => {
  const value = search.toLowerCase();

  const filteredAppointments =
    filter === "Todos"
      ? appointments
      : appointments.filter(
          (a) => a.status === filter
        );

  return filteredAppointments.filter((a) => {
    return (
      a.client
        .toLowerCase()
        .includes(value) ||

      a.service
        .toLowerCase()
        .includes(value) ||

      a.staff
        .toLowerCase()
        .includes(value)
    );
  });
}, [appointments, filter, search]);

  const allByDate = React.useMemo(() => { const m: Record<string, Appointment[]> = {}; appointments.forEach((a) => { (m[a.date] ??= []).push(a); }); return m; }, [appointments]);
  const filteredByDate = React.useMemo(() => { const m: Record<string, Appointment[]> = {}; filtered.forEach((a) => { (m[a.date] ??= []).push(a); }); return m; }, [filtered]);
  const counts = React.useMemo(() => ({ Marcado: appointments.filter((a) => a.status === "Marcado").length, Concluído: appointments.filter((a) => a.status === "Concluído").length, Cancelado: appointments.filter((a) => a.status === "Cancelado").length }), [appointments]);

  const prevM = () => calMonth === 0 ? (setCalMonth(11), setCalYear((y) => y - 1)) : setCalMonth((m) => m - 1);
  const nextM = () => calMonth === 11 ? (setCalMonth(0), setCalYear((y) => y + 1)) : setCalMonth((m) => m + 1);
  const today = () => { setCalYear(new Date().getFullYear()); setCalMonth(new Date().getMonth()); };

  const openBooking = (d?: string) => { setBookingDate(d); setBookingOpen(true); };
  const handleSave = (a: Omit<Appointment, "id">) => { add(a); setBookingOpen(false); setDayModal(null); };

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  return (
    <div className="space-y-5 p-1 flex flex-col gap-1">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Agenda</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{appointments.length} agendamentos no total</p>
        </div>
        <Button onClick={() => openBooking()} className="btn-primary-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 shadow-lg">
          <Plus size={15} /> Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(["Marcado", "Concluído", "Cancelado"] as AppointmentStatus[]).map((s) => {
          const st = statusStyles[s];
          return (
            <button key={s} onClick={() => setFilter((f) => (f === s ? "Todos" : s))} className={cn("rounded-2xl border-2 p-3.5 flex items-center gap-3 transition-all text-left", filter === s ? cn(st.border, st.calBg, "shadow-md scale-[1.02]") : "border-border bg-card hover:border-primary/30")}>
              <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", st.dot)} />
              <div>
                <p className={cn("text-xl font-bold tabular-nums", st.chipText)}>{counts[s]}</p>
                <p className="text-[11px] text-muted-foreground">{st.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        {statusFilters.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={cn("px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150", filter === f.key ? "btn-primary-gradient text-white border-transparent shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground")}>
            {f.label}
          </button>
        ))}
        <Button variant="outline" onClick={today} className="ml-auto px-3.5 py-1.5 h-auto rounded-full text-xs font-medium border border-border bg-card text-muted-foreground hover:text-foreground transition-all">
          Hoje
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="h-1 w-full btn-primary-gradient" />
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <button onClick={prevM} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft size={16} /></button>
          <h3 className="text-sm font-bold text-foreground tracking-wide">{MONTHS[calMonth]} <span className="text-muted-foreground font-normal">{calYear}</span></h3>
          <button onClick={nextM} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><ChevronRight size={16} /></button>
        </div>
        <div className="grid grid-cols-7 bg-muted/30 border-b border-border">
          {WEEKDAYS.map((d, i) => (
            <div key={d} className={cn("py-2.5 text-center text-[10px] font-bold uppercase tracking-widest", business.closedDays.includes(i) ? "text-rose-500/70" : "text-muted-foreground")}>
              {d}
            </div>
          ))}
        </div>
        <div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 divide-x divide-border border-b border-border last:border-b-0">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="min-h-[104px] bg-muted/10" />;
                const dateStr = fmtDate(calYear, calMonth, day);
                const wd = new Date(dateStr + "T00:00:00").getDay();
                const todayFlg = isToday(calYear, calMonth, day);
                const pastFlg = isPast(dateStr);
                const closed = business.closedDays.includes(wd);
                const dayAppts = filteredByDate[dateStr] ?? [];
                const allCnt = (allByDate[dateStr] ?? []).filter((a) => a.status !== "Cancelado").length;
                
                // Mapeia dinamicamente os estilos de background usando OKLCH
                const appts = allByDate[dateStr] ?? [];
                const active = appts.filter(a => a.status !== "Cancelado");
                const marcados = appts.filter(a => a.status === "Marcado");
                const concluidos = appts.filter(a => a.status === "Concluído");
                const cancelados = appts.filter(a => a.status === "Cancelado");
                
                const dayBg = appts.length === 0
                  ? (todayFlg ? "" : pastFlg ? "bg-muted/30" : "bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]")
                  : marcados.length > 0 ? "bg-sky-500/[0.05]"
                  : concluidos.length > 0 && cancelados.length === 0 ? "bg-emerald-500/[0.05]"
                  : cancelados.length > 0 && active.length === 0 ? "bg-rose-500/[0.03]"
                  : "bg-sky-500/[0.02]";

                return (
                  <button key={di} disabled={closed} onClick={() => setDayModal(dateStr)} className={cn(
                    "min-h-[104px] p-2 text-left flex flex-col gap-1.5 transition-all duration-150 group focus:outline-none hover:brightness-95 hover:shadow-inner",
                    closed ? "bg-muted/30 cursor-not-allowed" : dayBg,
                    todayFlg && "ring-2 ring-inset ring-primary/40",
                  )}>
                    <div className="flex items-center justify-between w-full">
                      <span className={cn("w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-all", todayFlg ? "btn-primary-gradient text-white shadow" : pastFlg ? "text-muted-foreground/50" : closed ? "text-muted-foreground/40 line-through" : "text-foreground group-hover:bg-white/60")}>{day}</span>
                      {allCnt > 0 && !todayFlg && <span className="text-[9px] font-bold rounded-full min-w-4 h-4 px-1 bg-sky-500 text-white flex items-center justify-center">{allCnt}</span>}
                    </div>
                    {closed ? (
                      <span className="text-[9px] text-rose-500/70 font-semibold flex items-center gap-1"><Ban size={9} /> Fechado</span>
                    ) : (
                      <div className="flex flex-col gap-0.5 overflow-hidden w-full">
                        {dayAppts.slice(0, 3).map((appt) => {
                          const ss = statusStyles[appt.status];
                          return (
                            <div key={appt.id} className={cn("w-full rounded-md px-1.5 py-[2px] text-[9px] font-bold truncate border leading-4", ss.chip, ss.calText, appt.status === "Cancelado" && "line-through opacity-70")}>
                              <span className="tabular-nums mr-1 opacity-70">{appt.time}</span>{appt.client}
                            </div>
                          );
                        })}
                        {dayAppts.length > 3 && <span className="text-[9px] text-muted-foreground pl-1 font-semibold">+{dayAppts.length - 3} mais</span>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Day panel Modal */}
      <Modal open={!!dayModal} onClose={() => setDayModal(null)} title={dayModal ? (() => { const { day, month, year } = parseDate(dayModal); return `${day} de ${MONTHS[month]} de ${year}`; })() : ""}>
        <div className="space-y-2 min-w-[340px]">
          {dayModal && (allByDate[dayModal] ?? []).length === 0 ? (
            <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground">
              <Sparkles size={22} className="opacity-30" />
              <p className="text-sm">Dia livre — sem agendamentos.</p>
            </div>
          ) : (
            dayModal && (allByDate[dayModal] ?? []).sort((a, b) => a.time.localeCompare(b.time)).map((appt) => {
              const s = statusStyles[appt.status];
              return (
                <button key={appt.id} onClick={() => { setDayModal(null); setDetailAppt(appt); setDetailOpen(true); }} className={cn("w-full text-left rounded-xl p-3 border-2 transition-all hover:-translate-y-0.5", s.border, s.calBg, appt.status === "Cancelado" && "opacity-60")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-bold tabular-nums", s.calText)}>{appt.time}</span>
                      <span className="text-sm font-semibold">{appt.client}</span>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1"><Scissors size={9} className="inline mr-1" />{appt.service} · <User size={9} className="inline mx-1" />{appt.staff} · <strong className="text-foreground">{fmtBRL(appt.price)}</strong></p>
                </button>
              );
            })
          )}
          {dayModal && !isPast(dayModal) && !business.closedDays.includes(new Date(dayModal + "T00:00:00").getDay()) && (
            <Button variant="outline" onClick={() => { const d = dayModal; setDayModal(null); openBooking(d); }} className="w-full flex items-center justify-center gap-2 py-6 rounded-xl text-sm font-medium border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all">
              <Plus size={14} /> Novo agendamento neste dia
            </Button>
          )}
        </div>
      </Modal>

      <DetailModal open={detailOpen} onClose={() => setDetailOpen(false)} appt={detailAppt} onSetStatus={(id, st) => { update(id, { status: st }); setDetailAppt((a) => (a ? { ...a, status: st } : a)); }} onDelete={del} />

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} preDate={bookingDate} onSave={handleSave} existing={appointments} />
    </div>
  );
}