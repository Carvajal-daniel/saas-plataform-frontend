import * as React from "react";
import { Plus, Trash2, Check, X as XIcon } from "lucide-react";
import { newId, useDashboard, type Appointment, type AppointmentStatus } from "../lib/dashboard-store";
import { Button } from "@/components/ui/Button";
import { Field, inputCls, Modal } from "./Modal";
import { cn } from "@/features/lib/utils";

const statusFilters: { key: "Todos" | AppointmentStatus; label: string }[] = [
  { key: "Todos", label: "Todos" },
  { key: "Marcado", label: "Marcados" },
  { key: "Concluído", label: "Concluídos" },
  { key: "Cancelado", label: "Cancelados" },
];

const statusStyles: Record<AppointmentStatus, string> = {
  Marcado: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  Concluído: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Cancelado: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function AppointmentsTab() {
  const { appointments, setAppointments, staff, services } = useDashboard();
  const [filter, setFilter] = React.useState<"Todos" | AppointmentStatus>("Todos");
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<Omit<Appointment, "id">>({
    client: "", service: services[0]?.name ?? "", staff: staff[0]?.name ?? "",
    date: new Date().toISOString().slice(0, 10), time: "10:00", status: "Marcado", price: services[0]?.price ?? 0,
  });

  const list = filter === "Todos" ? appointments : appointments.filter(a => a.status === filter);

  const save = () => {
    if (!form.client.trim()) return;
    setAppointments(a => [{ id: newId(), ...form }, ...a]);
    setOpen(false);
    setForm({ ...form, client: "" });
  };

  const setStatus = (id: string, status: AppointmentStatus) =>
    setAppointments(a => a.map(x => x.id === id ? { ...x, status } : x));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Agendamentos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acompanhe e gerencie todos os horários.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="btn-primary-gradient h-10 px-5">
          <Plus className="h-4 w-4" /> Novo Agendamento
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
        {statusFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              filter === f.key ? "bg-foreground/5 text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >{f.label}
            <span className="ml-2 text-xs text-muted-foreground">
              {f.key === "Todos" ? appointments.length : appointments.filter(a => a.status === f.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {list.length === 0 && <li className="p-10 text-center text-sm text-muted-foreground">Nenhum agendamento encontrado.</li>}
          {list.map(a => (
            <li key={a.id} className="grid grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-muted/30">
              <div className="col-span-12 flex items-center gap-3 md:col-span-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-foreground">
                  {a.client.split(" ").map(s => s[0]).slice(0,2).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{a.client}</div>
                  <div className="text-xs text-muted-foreground">{a.service}</div>
                </div>
              </div>
              <div className="col-span-6 text-sm text-muted-foreground md:col-span-3">{a.staff}</div>
              <div className="col-span-6 text-sm text-muted-foreground md:col-span-2">
                {new Date(a.date).toLocaleDateString("pt-BR")} • {a.time}
              </div>
              <div className="col-span-6 md:col-span-2">
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[a.status])}>{a.status}</span>
              </div>
              <div className="col-span-6 flex items-center justify-end gap-1 md:col-span-1">
                {a.status === "Marcado" && (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => setStatus(a.id, "Concluído")} title="Concluir"><Check className="h-4 w-4 text-emerald-600" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setStatus(a.id, "Cancelado")} title="Cancelar"><XIcon className="h-4 w-4 text-rose-600" /></Button>
                  </>
                )}
                <Button variant="ghost" size="icon" onClick={() => setAppointments(arr => arr.filter(x => x.id !== a.id))} title="Excluir">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo Agendamento"
        footer={<>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={save} className="btn-primary-gradient">Criar agendamento</Button>
        </>}
      >
        <Field label="Cliente"><input className={inputCls} value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="Nome do cliente" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Serviço">
            <select className={inputCls} value={form.service} onChange={e => {
              const s = services.find(x => x.name === e.target.value);
              setForm({ ...form, service: e.target.value, price: s?.price ?? 0 });
            }}>
              {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Profissional">
            <select className={inputCls} value={form.staff} onChange={e => setForm({ ...form, staff: e.target.value })}>
              {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Data"><input type="date" className={inputCls} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Hora"><input type="time" className={inputCls} value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
