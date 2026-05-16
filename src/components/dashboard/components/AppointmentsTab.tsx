import * as React from "react";
import {
  Plus, Trash2, Check, X as XIcon,
  ChevronLeft, ChevronRight, Clock, User, Scissors,
  Sparkles, CalendarDays, DollarSign, AlertCircle,
} from "lucide-react";
import {
  newId, useDashboard,
  type Appointment, type AppointmentStatus,
} from "../lib/dashboard-store";
import { Button } from "@/components/ui/Button";
import { Field, inputCls, Modal } from "./Modal";
import { cn } from "@/features/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
═══════════════════════════════════════════════════════════════════════════ */

const MONTHS       = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const WEEKDAYS     = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

/** Horários disponíveis por padrão (08:00–20:00, de 30 em 30 min) */
const ALL_SLOTS = Array.from({ length: 25 }, (_, i) => {
  const totalMin = 480 + i * 30; // começa às 08:00
  const h = String(Math.floor(totalMin / 60)).padStart(2, "0");
  const m = String(totalMin % 60).padStart(2, "0");
  return `${h}:${m}`;
});

const statusStyles: Record<AppointmentStatus, {
  dot: string; chip: string; chipText: string; border: string;
  calBg: string; calText: string; label: string;
}> = {
  Marcado: {
    dot: "bg-sky-400", chip: "bg-sky-50 border-sky-200", chipText: "text-sky-700",
    border: "border-sky-300", calBg: "bg-sky-50", calText: "text-sky-700", label: "Marcado",
  },
  Concluído: {
    dot: "bg-emerald-400", chip: "bg-emerald-50 border-emerald-200", chipText: "text-emerald-700",
    border: "border-emerald-300", calBg: "bg-emerald-50", calText: "text-emerald-700", label: "Concluído",
  },
  Cancelado: {
    dot: "bg-rose-400", chip: "bg-rose-50 border-rose-200", chipText: "text-rose-500",
    border: "border-rose-200", calBg: "bg-rose-50", calText: "text-rose-500", label: "Cancelado",
  },
};

const statusFilters: { key: "Todos" | AppointmentStatus; label: string }[] = [
  { key: "Todos",     label: "Todos"      },
  { key: "Marcado",   label: "Marcados"   },
  { key: "Concluído", label: "Concluídos" },
  { key: "Cancelado", label: "Cancelados" },
];

const fmtBRL   = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const getDays  = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const getFirst = (y: number, m: number) => new Date(y, m, 1).getDay();
const fmtDate  = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const parseDate = (s: string) => { const [y, m, d] = s.split("-").map(Number); return { year: y, month: m - 1, day: d }; };
const isToday   = (y: number, m: number, d: number) => {
  const t = new Date(); return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
};
const isPast = (dateStr: string) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(dateStr + "T00:00:00") < today;
};

/* ═══════════════════════════════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const s = statusStyles[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", s.chip, s.chipText)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BOOKING WIZARD MODAL
   Fluxo: 1. Seleciona Serviço → 2. Seleciona Profissional → 3. Seleciona Horário → 4. Dados do cliente
═══════════════════════════════════════════════════════════════════════════ */

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  preDate?: string;               // vem do clique no dia do calendário
  onSave: (appt: Omit<Appointment, "id">) => void;
  existingAppointments: Appointment[];
}

function BookingModal({ open, onClose, preDate, onSave, existingAppointments }: BookingModalProps) {
  const { services, staff: staffList } = useDashboard();

  const [step,        setStep       ] = React.useState(1);
  const [serviceId,   setServiceId  ] = React.useState("");
  const [staffId,     setStaffId    ] = React.useState("");
  const [date,        setDate       ] = React.useState(preDate ?? "");
  const [time,        setTime       ] = React.useState("");
  const [client,      setClient     ] = React.useState("");
  const [notes,       setNotes      ] = React.useState("");

  // Reset ao abrir
  React.useEffect(() => {
    if (open) {
      setStep(1); setServiceId(""); setStaffId("");
      setDate(preDate ?? ""); setTime(""); setClient(""); setNotes("");
    }
  }, [open, preDate]);

  const selectedService = services.find(s => s.id === serviceId);
  const selectedStaff   = staffList.find(s => s.id === staffId);

  // Profissionais ativos
  const activeStaff = staffList.filter(s => s.status === "Ativo");

  // Horários já ocupados para o par (staff, date) — ignora cancelados
  const bookedSlots = React.useMemo(() => {
    if (!staffId || !date) return new Set<string>();
    return new Set(
      existingAppointments
        .filter(a => a.staff === selectedStaff?.name && a.date === date && a.status !== "Cancelado")
        .map(a => a.time),
    );
  }, [staffId, date, existingAppointments, selectedStaff]);

  const availableSlots = ALL_SLOTS.filter(s => !bookedSlots.has(s));

  const canNext = () => {
    if (step === 1) return !!serviceId;
    if (step === 2) return !!staffId && !!date;
    if (step === 3) return !!time;
    return false;
  };

  const handleSave = () => {
    if (!client.trim() || !selectedService || !selectedStaff || !date || !time) return;
    onSave({
      client,
      service: selectedService.name,
      staff:   selectedStaff.name,
      date,
      time,
      status: "Marcado",
      price:  selectedService.price,
    } as Omit<Appointment, "id">);
  };

  const stepLabels = ["Serviço", "Profissional & Data", "Horário", "Cliente"];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo Agendamento"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            {step === 1 ? "Cancelar" : "← Voltar"}
          </button>
          {step < 4 ? (
            <button
              disabled={!canNext()}
              onClick={() => setStep(s => s + 1)}
              className={cn(
                "btn-primary-gradient px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all",
                !canNext() && "opacity-40 cursor-not-allowed",
              )}
            >
              Próximo →
            </button>
          ) : (
            <button
              disabled={!client.trim()}
              onClick={handleSave}
              className={cn(
                "btn-primary-gradient px-5 py-2 rounded-xl text-white text-sm font-semibold",
                !client.trim() && "opacity-40 cursor-not-allowed",
              )}
            >
              Confirmar Agendamento
            </button>
          )}
        </div>
      }
    >
      <div className="min-w-[360px] space-y-5">

        {/* Step indicator */}
        <div className="flex items-center gap-0">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done   = n < step;
            return (
              <React.Fragment key={n}>
                <div className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                    done  && "btn-primary-gradient border-transparent text-white",
                    active && "border-primary text-primary bg-primary/10",
                    !done && !active && "border-border text-muted-foreground",
                  )}>
                    {done ? <Check size={12} /> : n}
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium whitespace-nowrap",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}>
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={cn("flex-1 h-0.5 mb-4 mx-1 transition-all", done ? "bg-primary/60" : "bg-border")} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── STEP 1: Serviço ── */}
        {step === 1 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground mb-3">Escolha o serviço</p>
            {services.length === 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                <AlertCircle size={15} /> Nenhum serviço cadastrado. Adicione em Gestão → Serviços.
              </div>
            )}
            <div className="grid gap-2 max-h-72 overflow-y-auto pr-1">
              {services.map(svc => (
                <button
                  key={svc.id}
                  onClick={() => setServiceId(svc.id)}
                  className={cn(
                    "w-full text-left rounded-2xl p-4 border-2 transition-all duration-150",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    serviceId === svc.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{svc.name}</p>
                      {svc.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{svc.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="font-bold text-sm text-foreground">{fmtBRL(svc.price)}</p>
                      <p className="text-xs text-muted-foreground">{svc.duration} min</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Profissional & Data ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Escolha o profissional</p>
              {activeStaff.length === 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                  <AlertCircle size={15} /> Nenhum profissional ativo. Verifique em Gestão → Funcionários.
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {activeStaff.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setStaffId(s.id)}
                    className={cn(
                      "flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all",
                      staffId === s.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 bg-card",
                    )}
                  >
                    {s.avatar ? (
                      <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl btn-primary-gradient flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {s.name.split(" ").map((p: string) => p[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{s.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Field label="Data do agendamento">
              <input
                type="date"
                className={inputCls}
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => { setDate(e.target.value); setTime(""); }}
              />
            </Field>
          </div>
        )}

        {/* ── STEP 3: Horário ── */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Horários disponíveis</p>
              <span className="text-xs text-muted-foreground">
                {availableSlots.length} disponíveis
              </span>
            </div>
            {availableSlots.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground">
                <CalendarDays size={24} className="opacity-40" />
                <p className="text-sm text-center">
                  Todos os horários estão ocupados para<br />
                  <strong className="text-foreground">{selectedStaff?.name}</strong> nesta data.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                {ALL_SLOTS.map(slot => {
                  const booked = bookedSlots.has(slot);
                  return (
                    <button
                      key={slot}
                      disabled={booked}
                      onClick={() => setTime(slot)}
                      className={cn(
                        "py-2 rounded-xl text-xs font-semibold border-2 transition-all",
                        booked
                          ? "border-border bg-muted text-muted-foreground/40 cursor-not-allowed line-through"
                          : time === slot
                          ? "btn-primary-gradient border-transparent text-white shadow-md scale-105"
                          : "border-border bg-card text-foreground hover:border-primary/60 hover:bg-primary/5",
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Resumo do serviço */}
            {selectedService && (
              <div className="rounded-xl bg-muted/40 border border-border p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg btn-primary-gradient flex items-center justify-center shrink-0">
                  <Scissors size={13} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{selectedService.name}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedService.duration} min</p>
                </div>
                <p className="text-sm font-bold text-foreground shrink-0">{fmtBRL(selectedService.price)}</p>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Cliente ── */}
        {step === 4 && (
          <div className="space-y-4">
            <Field label="Nome do cliente *">
              <input
                className={inputCls}
                value={client}
                onChange={e => setClient(e.target.value)}
                placeholder="Ex: Maria Silva"
                autoFocus
              />
            </Field>
            <Field label="Observações (opcional)">
              <textarea
                rows={2}
                className={inputCls}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Alergias, preferências…"
              />
            </Field>

            {/* Resumo completo */}
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="h-1 w-full btn-primary-gradient" />
              <div className="p-4 space-y-2.5 bg-card">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resumo</p>
                {[
                  { icon: <Scissors size={12} />, label: "Serviço",       value: selectedService?.name ?? "" },
                  { icon: <User size={12} />,     label: "Profissional",  value: selectedStaff?.name ?? "" },
                  { icon: <CalendarDays size={12} />, label: "Data",      value: date ? (() => { const {day,month,year} = parseDate(date); return `${day} de ${MONTHS[month]} de ${year}`; })() : "" },
                  { icon: <Clock size={12} />,    label: "Horário",       value: time },
                  { icon: <DollarSign size={12} />, label: "Valor",       value: fmtBRL(selectedService?.price ?? 0) },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-4">{icon}</span>
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
   DETAIL MODAL — ver / alterar status / excluir
═══════════════════════════════════════════════════════════════════════════ */

interface ApptDetailProps {
  open: boolean; onClose: () => void; appt: Appointment | null;
  onSetStatus: (id: string, s: AppointmentStatus) => void;
  onDelete:    (id: string) => void;
}

function ApptDetailModal({ open, onClose, appt, onSetStatus, onDelete }: ApptDetailProps) {
  if (!appt) return null;
  const { day, month, year } = parseDate(appt.date);
  const s = statusStyles[appt.status];

  return (
    <Modal open={open} onClose={onClose} title="Detalhes do Agendamento">
      <div className="space-y-4 min-w-[340px]">

        {/* Hero */}
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
              { icon: <Clock size={12} />,         label: "Horário",      value: appt.time },
              { icon: <User size={12} />,           label: "Profissional", value: appt.staff },
              { icon: <CalendarDays size={12} />,   label: "Data",         value: `${day} de ${MONTHS[month]}` },
              { icon: <DollarSign size={12} />,     label: "Valor",        value: (appt as any).price ? fmtBRL((appt as any).price) : "—" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="rounded-xl bg-muted/50 p-2.5">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  {icon} {label}
                </span>
                <span className="text-sm font-semibold text-foreground">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {appt.status !== "Concluído" && (
          <div className={cn("grid gap-2", appt.status === "Cancelado" ? "grid-cols-1" : "grid-cols-2")}>
            <button
              onClick={() => { onSetStatus(appt.id, "Concluído"); onClose(); }}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Check size={14} /> Marcar Concluído
            </button>
            {appt.status === "Marcado" && (
              <button
                onClick={() => { onSetStatus(appt.id, "Cancelado"); onClose(); }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                <XIcon size={14} /> Cancelar
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => { onDelete(appt.id); onClose(); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
        >
          <Trash2 size={13} /> Excluir agendamento
        </button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DAY PANEL MODAL — lista do dia + novo agendamento
═══════════════════════════════════════════════════════════════════════════ */

interface DayPanelProps {
  open: boolean; onClose: () => void; date: string;
  appointments: Appointment[];
  onSelect:  (a: Appointment) => void;
  onNew:     (date: string)   => void;
}

function DayPanel({ open, onClose, date, appointments, onSelect, onNew }: DayPanelProps) {
  if (!date) return null;
  const { day, month, year } = parseDate(date);
  const past = isPast(date);

  // Agrupa por status para exibição colorida
  const sorted = [...appointments].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <Modal open={open} onClose={onClose} title={`${day} de ${MONTHS[month]} de ${year}`}>
      <div className="min-w-[340px] space-y-3">

        {/* Info de disponibilidade */}
        {!past && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-border text-xs text-muted-foreground">
            <CalendarDays size={13} />
            <span>
              {sorted.filter(a => a.status !== "Cancelado").length} agendamento(s) ativo(s) neste dia
            </span>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="py-8 flex flex-col items-center gap-2 text-muted-foreground">
            <Sparkles size={22} className="opacity-30" />
            <p className="text-sm">Dia livre — sem agendamentos.</p>
          </div>
        ) : (
          sorted.map(appt => {
            const s = statusStyles[appt.status];
            return (
              <button
                key={appt.id}
                onClick={() => onSelect(appt)}
                className={cn(
                  "w-full text-left rounded-2xl p-3.5 border-2 transition-all duration-150",
                  "hover:-translate-y-0.5 hover:shadow-lg",
                  s.border, s.calBg,
                  appt.status === "Cancelado" && "opacity-60",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("text-sm font-bold tabular-nums shrink-0", s.calText)}>
                      {appt.time}
                    </span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-sm font-semibold text-foreground truncate">{appt.client}</span>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
                <div className="mt-1.5 pl-0 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Scissors size={10} />{appt.service}</span>
                  <span className="opacity-30">·</span>
                  <span className="flex items-center gap-1"><User size={10} />{appt.staff}</span>
                  {(appt as any).price > 0 && (
                    <>
                      <span className="opacity-30">·</span>
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        {fmtBRL((appt as any).price)}
                      </span>
                    </>
                  )}
                </div>
              </button>
            );
          })
        )}

        {!past && (
          <button
            onClick={() => { onClose(); onNew(date); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <Plus size={14} /> Novo agendamento neste dia
          </button>
        )}
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export function AppointmentsTab() {
  const { appointments, setAppointments } = useDashboard();

  // ── CRUD ──
  const addAppointment = (appt: Omit<Appointment, "id">) =>
    setAppointments((arr: Appointment[]) => [...arr, { ...appt, id: newId() } as Appointment]);

  const updateAppointment = (id: string, patch: Partial<Appointment>) =>
    setAppointments((arr: Appointment[]) => arr.map(a => a.id === id ? { ...a, ...patch } : a));

  const deleteAppointment = (id: string) =>
    setAppointments((arr: Appointment[]) => arr.filter(a => a.id !== id));

  // ── UI State ──
  const [filter,      setFilter     ] = React.useState<"Todos" | AppointmentStatus>("Todos");
  const [calYear,     setCalYear    ] = React.useState(() => new Date().getFullYear());
  const [calMonth,    setCalMonth   ] = React.useState(() => new Date().getMonth());
  const [dayModal,    setDayModal   ] = React.useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [bookingDate, setBookingDate] = React.useState<string | undefined>();
  const [detailAppt,  setDetailAppt ] = React.useState<Appointment | null>(null);
  const [detailOpen,  setDetailOpen ] = React.useState(false);

  // ── Derived ──
  const filtered = React.useMemo(() =>
    filter === "Todos" ? appointments : appointments.filter(a => a.status === filter),
    [appointments, filter],
  );

  // apptsByDate usa TODOS os agendamentos para o calendário (sem filtro visual)
  const allByDate = React.useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach(a => { (map[a.date] ??= []).push(a); });
    return map;
  }, [appointments]);

  // Para mostrar no calendário, respeita o filtro
  const filteredByDate = React.useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    filtered.forEach(a => { (map[a.date] ??= []).push(a); });
    return map;
  }, [filtered]);

  const countByStatus = React.useMemo(() => ({
    Marcado:   appointments.filter(a => a.status === "Marcado").length,
    Concluído: appointments.filter(a => a.status === "Concluído").length,
    Cancelado: appointments.filter(a => a.status === "Cancelado").length,
  }), [appointments]);

  // ── Navigation ──
  const prevMonth = () => calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1);
  const nextMonth = () => calMonth === 11 ? (setCalMonth(0),  setCalYear(y => y + 1)) : setCalMonth(m => m + 1);
  const goToday   = () => { setCalYear(new Date().getFullYear()); setCalMonth(new Date().getMonth()); };

  // ── Booking handlers ──
  const openBooking = (date?: string) => {
    setBookingDate(date);
    setBookingOpen(true);
  };

  const handleSaveBooking = (appt: Omit<Appointment, "id">) => {
    addAppointment(appt);
    setBookingOpen(false);
    setDayModal(null);
  };

  const handleSelectAppt = (appt: Appointment) => {
    setDetailAppt(appt);
    setDetailOpen(true);
  };

  // ── Calendar grid ──
  const daysInMonth  = getDays(calYear, calMonth);
  const firstDayOfWk = getFirst(calYear, calMonth);
  const cells: (number | null)[] = [...Array(firstDayOfWk).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  /* ── Helper: cor do fundo do dia ─────────────────────────────────────────
     - Se tem agendamentos Marcados → azul claro
     - Se só tem Concluídos → verde claro
     - Se só tem Cancelados → rosa claro / tachado visual
     - Hoje → destaque primário
     - Passado sem agendamentos → cinza levíssimo
  ─────────────────────────────────────────────────────────────────────── */
  const getDayBg = (dateStr: string, todayFlg: boolean, pastFlg: boolean) => {
    const appts = allByDate[dateStr] ?? [];
    const active    = appts.filter(a => a.status !== "Cancelado");
    const marcados  = appts.filter(a => a.status === "Marcado");
    const concluidos= appts.filter(a => a.status === "Concluído");
    const cancelados= appts.filter(a => a.status === "Cancelado");

    if (appts.length === 0) {
      if (todayFlg) return "";
      if (pastFlg)  return "bg-muted/30";
      return "bg-emerald-50/40"; // futuro livre = levemente verde (disponível)
    }
    if (marcados.length  > 0) return "bg-sky-50/70";
    if (concluidos.length > 0 && cancelados.length === 0) return "bg-emerald-50/60";
    if (cancelados.length > 0 && active.length === 0)     return "bg-rose-50/40";
    return "bg-sky-50/40";
  };

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-6 p-1">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Agenda</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {appointments.length} agendamento{appointments.length !== 1 ? "s" : ""} no total
          </p>
        </div>
        <button
          onClick={() => openBooking()}
          className="btn-primary-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shrink-0 shadow-lg"
        >
          <Plus size={15} /> Novo Agendamento
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {(["Marcado", "Concluído", "Cancelado"] as AppointmentStatus[]).map(s => {
          const st = statusStyles[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(f => f === s ? "Todos" : s)}
              className={cn(
                "rounded-2xl border-2 p-3.5 flex items-center gap-3 transition-all text-left",
                filter === s ? cn(st.border, st.calBg, "shadow-md scale-[1.02]") : "border-border bg-card hover:border-primary/30",
              )}
            >
              <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", st.dot)} />
              <div>
                <p className={cn("text-xl font-bold tabular-nums", st.chipText)}>{countByStatus[s]}</p>
                <p className="text-[11px] text-muted-foreground">{st.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Filter pills ── */}
      <div className="flex gap-2 flex-wrap items-center">
        {statusFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
              filter === f.key
                ? "btn-primary-gradient text-white border-transparent shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={goToday}
          className="ml-auto px-3.5 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          Hoje
        </button>
      </div>

      {/* ── Calendar ── */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">

        {/* Brand stripe */}
        <div className="h-1 w-full btn-primary-gradient" />

        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <h3 className="text-sm font-bold text-foreground tracking-wide">
              {MONTHS[calMonth]} <span className="text-muted-foreground font-normal">{calYear}</span>
            </h3>
          </div>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Legend bar */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-muted/30 flex-wrap">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Legenda:</span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200" /> Dia livre
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-sky-100 border border-sky-200" /> Marcado
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300" /> Concluído
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-200" /> Cancelado
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-muted border border-border" /> Passado
          </span>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-muted/20 border-b border-border">
          {WEEKDAYS.map(d => (
            <div key={d} className="py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 divide-x divide-border border-b border-border last:border-b-0">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="min-h-[104px] bg-muted/10" />;

                const dateStr   = fmtDate(calYear, calMonth, day);
                const todayFlg  = isToday(calYear, calMonth, day);
                const pastFlg   = isPast(dateStr);
                const dayAppts  = filteredByDate[dateStr] ?? [];
                const allDayApp = allByDate[dateStr] ?? [];
                const activeCnt = allDayApp.filter(a => a.status !== "Cancelado").length;
                const dayBg     = getDayBg(dateStr, todayFlg, pastFlg);

                return (
                  <button
                    key={di}
                    onClick={() => setDayModal(dateStr)}
                    className={cn(
                      "min-h-[104px] p-2 text-left flex flex-col gap-1.5 transition-all duration-150 group focus:outline-none",
                      "hover:brightness-95 hover:shadow-inner",
                      dayBg,
                      todayFlg && "ring-2 ring-inset ring-primary/30",
                    )}
                  >
                    {/* Day number */}
                    <div className="flex items-center justify-between w-full">
                      <span className={cn(
                        "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-all",
                        todayFlg
                          ? "btn-primary-gradient text-white shadow"
                          : pastFlg
                          ? "text-muted-foreground/60"
                          : "text-foreground group-hover:bg-white/60",
                      )}>
                        {day}
                      </span>
                      {/* Contador de agendamentos ativos */}
                      {activeCnt > 0 && !todayFlg && (
                        <span className={cn(
                          "text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center",
                          "bg-sky-400 text-white",
                        )}>
                          {activeCnt}
                        </span>
                      )}
                    </div>

                    {/* Chips de agendamentos */}
                    <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                      {dayAppts
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .slice(0, 3)
                        .map(appt => {
                          const ss = statusStyles[appt.status];
                          return (
                            <div key={appt.id} className={cn(
                              "w-full rounded-md px-1.5 py-[2px] text-[9px] font-bold leading-4 truncate border",
                              ss.chip, ss.calText,
                              appt.status === "Cancelado" && "line-through opacity-70",
                            )}>
                              <span className="tabular-nums mr-1 opacity-70">{appt.time}</span>
                              {appt.client}
                            </div>
                          );
                        })}
                      {dayAppts.length > 3 && (
                        <span className="text-[9px] text-muted-foreground pl-1 font-semibold">
                          +{dayAppts.length - 3} mais
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Modals ── */}

      {/* Day panel */}
      <DayPanel
        open={!!dayModal}
        onClose={() => setDayModal(null)}
        date={dayModal ?? ""}
        appointments={dayModal ? (allByDate[dayModal] ?? []) : []}
        onSelect={appt => { setDayModal(null); handleSelectAppt(appt); }}
        onNew={date => { setDayModal(null); openBooking(date); }}
      />

      {/* Appointment detail */}
      <ApptDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        appt={detailAppt}
        onSetStatus={(id, status) => { updateAppointment(id, { status }); setDetailAppt(a => a ? { ...a, status } : a); }}
        onDelete={id => { deleteAppointment(id); setDetailOpen(false); }}
      />

      {/* Booking wizard */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preDate={bookingDate}
        onSave={handleSaveBooking}
        existingAppointments={appointments}
      />
    </div>
  );
}
