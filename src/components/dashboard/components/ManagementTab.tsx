import * as React from "react";
import { Plus, Pencil, Trash2, Users, Tag } from "lucide-react";
import { Modal, Field, inputCls } from "./Modal";
import { Button } from "@/components/ui/Button";
import { newId, useDashboard, type Service, type Staff, type StaffStatus } from "../lib/dashboard-store";
import { cn } from "@/features/lib/utils";

const STATUSES: StaffStatus[] = ["Ativo", "De Férias", "Ausente", "Inativo"];
const statusBadge: Record<StaffStatus, string> = {
  "Ativo": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "De Férias": "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  "Ausente": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Inativo": "bg-muted text-muted-foreground",
};

const fmtBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ManagementTab() {
  const [section, setSection] = React.useState<"staff" | "services">("staff");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Gestão</h1>
        <p className="mt-1 text-sm text-muted-foreground">Administre sua equipe e catálogo de serviços.</p>
      </div>
      <div className="inline-flex gap-1 rounded-xl border border-border bg-card p-1">
        <button onClick={() => setSection("staff")} className={cn("flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all", section === "staff" ? "bg-foreground/5 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          <Users className="h-4 w-4" /> Funcionários
        </button>
        <button onClick={() => setSection("services")} className={cn("flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all", section === "services" ? "bg-foreground/5 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          <Tag className="h-4 w-4" /> Serviços
        </button>
      </div>
      {section === "staff" ? <StaffPanel /> : <ServicesPanel />}
    </div>
  );
}

function StaffPanel() {
  const { staff, setStaff } = useDashboard();

  const [editing, setEditing] =
    React.useState<Staff | null>(null);

  const [open, setOpen] =
    React.useState(false);

  const start = (s?: Staff) => {
    setEditing(
      s ?? {
        id: "",
        name: "",
        role: "",
        status: "Ativo",
        avatar: null,
      }
    );

    setOpen(true);
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file || !editing) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setEditing({
        ...editing,
        avatar: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
  };

  const save = () => {
    if (!editing || !editing.name.trim()) return;

    setStaff((arr) =>
      editing.id
        ? arr.map((s) =>
            s.id === editing.id ? editing : s
          )
        : [
            ...arr,
            {
              ...editing,
              id: newId(),
            },
          ]
    );

    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() => start()}
          className="btn-primary-gradient h-10 px-5"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((s) => (
          <div
            key={s.id}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start gap-3">
              {s.avatar ? (
                <img
                  src={s.avatar}
                  alt={s.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl btn-primary-gradient text-sm font-semibold text-white">
                  {s.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">
                  {s.name}
                </div>

                <div className="text-xs text-muted-foreground">
                  {s.role}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                  statusBadge[s.status]
                )}
              >
                {s.status}
              </span>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => start(s)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setStaff((a) =>
                      a.filter((x) => x.id !== s.id)
                    )
                  }
                >
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          editing?.id
            ? "Editar funcionário"
            : "Adicionar funcionário"
        }
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>

            <Button
              onClick={save}
              className="btn-primary-gradient"
            >
              Salvar
            </Button>
          </>
        }
      >
        {editing && (
          <>
            <div className="mb-5 flex flex-col items-center gap-3">
              {editing.avatar ? (
                <img
                  src={editing.avatar}
                  alt="Preview"
                  className="h-24 w-24 rounded-2xl object-cover border border-border"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-border bg-muted text-2xl font-semibold text-muted-foreground">
                  {editing.name
                    ? editing.name.charAt(0)
                    : "+"}
                </div>
              )}

              <label className="cursor-pointer">
                <div className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm font-medium transition-all hover:bg-muted">
                  Escolher foto
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-muted-foreground">
                Opcional
              </p>
            </div>

            <Field label="Nome">
              <input
                className={inputCls}
                value={editing.name}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    name: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Cargo">
              <input
                className={inputCls}
                value={editing.role}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    role: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Status">
              <select
                className={inputCls}
                value={editing.status}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    status:
                      e.target.value as StaffStatus,
                  })
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}
      </Modal>
    </>
  );
}
function ServicesPanel() {
  const { services, setServices } = useDashboard();
  const [editing, setEditing] = React.useState<Service | null>(null);
  const [open, setOpen] = React.useState(false);

  const start = (s?: Service) => {
    setEditing(s ?? { id: "", name: "", price: 0, duration: 30, description: "" });
    setOpen(true);
  };
  const save = () => {
    if (!editing || !editing.name.trim()) return;
    setServices(arr => editing.id ? arr.map(s => s.id === editing.id ? editing : s) : [...arr, { ...editing, id: newId() }]);
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => start()} className="btn-primary-gradient h-10 px-5"><Plus className="h-4 w-4" /> Adicionar</Button>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Serviço</th>
              <th className="px-5 py-3 text-left font-medium">Preço</th>
              <th className="px-5 py-3 text-left font-medium">Duração</th>
              <th className="px-5 py-3 text-left font-medium">Descrição</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map(s => (
              <tr key={s.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-3 font-medium text-foreground">{s.name}</td>
                <td className="px-5 py-3 text-foreground">{fmtBRL(s.price)}</td>
                <td className="px-5 py-3 text-muted-foreground">{s.duration} min</td>
                <td className="px-5 py-3 text-muted-foreground max-w-xs truncate">{s.description}</td>
                <td className="px-5 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => start(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setServices(a => a.filter(x => x.id !== s.id))}><Trash2 className="h-4 w-4 text-rose-500" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing?.id ? "Editar serviço" : "Adicionar serviço"}
        footer={<>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={save} className="btn-primary-gradient">Salvar</Button>
        </>}
      >
        {editing && <>
          <Field label="Nome"><input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Preço (R$)"><input type="number" className={inputCls} value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} /></Field>
            <Field label="Duração (min)"><input type="number" className={inputCls} value={editing.duration} onChange={e => setEditing({ ...editing, duration: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Descrição"><textarea rows={3} className={inputCls} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></Field>
        </>}
      </Modal>
    </>
  );
}
