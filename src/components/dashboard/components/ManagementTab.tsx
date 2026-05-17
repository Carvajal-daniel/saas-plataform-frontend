"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Upload, Users, Scissors } from "lucide-react";
import { Field, inputCls, Modal } from "./Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/features/lib/utils";
import { newId, type Staff, type StaffStatus, type Service, useDashboard, fmtBRL } from "../lib/dashboard-store";
import { toast } from "sonner";

const WD = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function ImageInput({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [url, setUrl] = React.useState(value ?? "");

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onChange(String(e.target?.result ?? ""));
    reader.readAsDataURL(f);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex items-center justify-center border border-border shrink-0">
        {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <Upload size={16} className="text-muted-foreground" />}
      </div>
      <div className="flex-1 space-y-2">
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => ref.current?.click()} className="px-3 py-1.5 h-auto text-xs font-semibold">Upload</Button>
          {value && <Button type="button" variant="ghost" onClick={() => onChange("")} className="px-3 py-1.5 h-auto text-xs text-muted-foreground hover:text-rose-500">Remover</Button>}
        </div>
        <input
          className={cn(inputCls, "py-1.5 text-xs")}
          placeholder="Ou cole uma URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => url && onChange(url)}
        />
      </div>
    </div>
  );
}

function StaffModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: Staff | null; onSave: (s: Staff) => void }
) {
  const [form, setForm] = React.useState<Staff>(initial ?? { id: newId(), name: "", role: "", status: "Ativo", commissionRate: 30, daysOff: [0], avatarUrl: "" });
  React.useEffect(() => { if (open) setForm(initial ?? { id: newId(), name: "", role: "", status: "Ativo", commissionRate: 30, daysOff: [0], avatarUrl: "" }); }, [open, initial]);
  
  const toggleDay = (d: number) => setForm((f) => ({ ...f, daysOff: f.daysOff.includes(d) ? f.daysOff.filter((x) => x !== d) : [...f.daysOff, d].sort() }));
  
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar Funcionário" : "Novo Funcionário"}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-muted-foreground">Cancelar</Button>
          <Button onClick={() => form.name && onSave(form)} disabled={!form.name} className="btn-primary-gradient px-5 py-2 rounded-xl text-sm font-semibold text-white">Salvar</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Foto"><ImageInput value={form.avatarUrl} onChange={(v) => setForm((f) => ({ ...f, avatarUrl: v }))} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome"><input className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
          <Field label="Cargo"><input className={inputCls} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as StaffStatus }))}>
              <option>Ativo</option><option>De Férias</option><option>Ausente</option><option>Inativo</option>
            </select>
          </Field>
          <Field label="Comissão (%)"><input type="number" min={0} max={100} className={inputCls} value={form.commissionRate} onChange={(e) => setForm((f) => ({ ...f, commissionRate: +e.target.value }))} /></Field>
        </div>
        <Field label="Dias de folga">
          <div className="flex flex-wrap gap-2">
            {WD.map((d, i) => (
              <button key={d} type="button" onClick={() => toggleDay(i)} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all", form.daysOff.includes(i) ? "btn-primary-gradient border-transparent text-white" : "border-border bg-card text-muted-foreground hover:border-primary/40")}>
                {d}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

function ServiceModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: Service | null; onSave: (s: Service) => void }) {
  const [form, setForm] = React.useState<Service>(initial ?? { id: newId(), name: "", price: 0, duration: 30, description: "", imageUrl: "" });
  React.useEffect(() => { if (open) setForm(initial ?? { id: newId(), name: "", price: 0, duration: 30, description: "", imageUrl: "" }); }, [open, initial]);

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar Serviço" : "Novo Serviço"}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-muted-foreground">Cancelar</Button>
          <Button onClick={() => form.name && onSave(form)} disabled={!form.name} className="btn-primary-gradient px-5 py-2 rounded-xl text-sm font-semibold text-white">Salvar</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Imagem"><ImageInput value={form.imageUrl} onChange={(v) => setForm((f) => ({ ...f, imageUrl: v }))} /></Field>
        <Field label="Nome"><input className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Preço (R$)"><input type="number" min={0} step={0.01} className={inputCls} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: +e.target.value }))} /></Field>
          <Field label="Duração (min)"><input type="number" min={5} step={5} className={inputCls} value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: +e.target.value }))} /></Field>
        </div>
        <Field label="Descrição"><textarea className={cn(inputCls, "min-h-[80px]")} value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></Field>
      </div>
    </Modal>
  );
}

export function ManagementTab() {
  const { staff, setStaff, services, setServices } = useDashboard();
  const [tab, setTab] = React.useState<"staff" | "services">("staff");
  const [staffOpen, setStaffOpen] = React.useState(false);
  const [staffEdit, setStaffEdit] = React.useState<Staff | null>(null);
  const [svcOpen, setSvcOpen] = React.useState(false);
  const [svcEdit, setSvcEdit] = React.useState<Service | null>(null);

  const saveStaff = (s: Staff) => { setStaff((arr) => (arr.some((x) => x.id === s.id) ? arr.map((x) => (x.id === s.id ? s : x)) : [...arr, s])
  );
    
  toast.success("Funcionário salvo com sucesso!");
    
    setStaffOpen(false); };
  const delStaff = (id: string) => setStaff((arr) => arr.filter((x) => x.id !== id));
  const saveSvc = (s: Service) => { setServices((arr) => (arr.some((x) => x.id === s.id) ? arr.map((x) => (x.id === s.id ? s : x)) : [...arr, s])); setSvcOpen(false); };
  const delSvc = (id: string) => setServices((arr) => arr.filter((x) => x.id !== id));

  const statusStyles: Record<StaffStatus, string> = {
    "Ativo": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
    "De Férias": "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30",
    "Ausente": "bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/30",
    "Inativo": "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {([{ k: "staff", l: "Funcionários", i: Users }, { k: "services", l: "Serviços", i: Scissors }] as { k: "staff" | "services"; l: string; i: typeof Users }[]).map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={cn("px-4 py-2 rounded-xl text-sm font-medium border inline-flex items-center gap-2 transition-all", tab === t.k ? "btn-primary-gradient border-none text-white" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40")}>
            <t.i size={14} /> {t.l}
          </button>
        ))}
        <Button onClick={() => { if (tab === "staff") { setStaffEdit(null); setStaffOpen(true); } else { setSvcEdit(null); setSvcOpen(true); } }} className="ml-auto btn-primary-gradient inline-flex items-center gap-2 px-4 py-2 h-auto rounded-xl text-sm font-semibold text-white">
          <Plus size={14} /> Adicionar
        </Button>
      </div>

      {tab === "staff" && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {staff.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card overflow-hidden group">
              <div className="h-1 w-full btn-primary-gradient" />
              <div className="p-5">
                <div className="flex items-start gap-3">
                  {s.avatarUrl ? <img src={s.avatarUrl} alt="" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-border" /> : <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-sm font-bold">{s.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.role}</p>
                    <span className={cn("inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border", statusStyles[s.status])}>{s.status}</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-muted/40 p-2.5"><p className="text-[10px] uppercase text-muted-foreground tracking-wide">Comissão</p><p className="font-bold text-gradient">{s.commissionRate}%</p></div>
                  <div className="rounded-xl bg-muted/40 p-2.5"><p className="text-[10px] uppercase text-muted-foreground tracking-wide">Folgas</p><p className="font-semibold text-foreground truncate">{s.daysOff.length === 0 ? "Nenhuma" : s.daysOff.map((d) => WD[d]).join(", ")}</p></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" onClick={() => { setStaffEdit(s); setStaffOpen(true); }} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 h-auto rounded-xl text-xs font-semibold"><Pencil size={12} /> Editar</Button>
                  <Button variant="ghost" onClick={() => delStaff(s.id)} className="px-3 py-2 h-auto rounded-xl text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30"><Trash2 size={13} /></Button>
                </div>
              </div>
            </div>
          ))}
          {staff.length === 0 && <div className="col-span-full p-10 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border">Nenhum funcionário cadastrado.</div>}
        </div>
      )}

      {tab === "services" && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-8 gap-4">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="aspect-[16/9] bg-muted overflow-hidden">
                {s.imageUrl ? <img src={s.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Scissors size={28} className="text-muted-foreground/40" /></div>}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="font-bold text-gradient text-sm whitespace-nowrap">{fmtBRL(s.price)}</p>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{s.description}</p>
                <p className="text-[11px] text-muted-foreground mt-2">⏱ {s.duration} min</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" onClick={() => { setSvcEdit(s); setSvcOpen(true); }} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 h-auto rounded-xl text-xs font-semibold"><Pencil size={12} /> Editar</Button>
                  <Button variant="ghost" onClick={() => delSvc(s.id)} className="px-3 py-2 h-auto rounded-xl text-xs text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30"><Trash2 size={13} /></Button>
                </div>
              </div>
            </div>
          ))}
          {services.length === 0 && <div className="col-span-full p-10 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border">Nenhum serviço cadastrado.</div>}
        </div>
      )}

      <StaffModal open={staffOpen} onClose={() => setStaffOpen(false)} initial={staffEdit} onSave={saveStaff} />
      <ServiceModal open={svcOpen} onClose={() => setSvcOpen(false)} initial={svcEdit} onSave={saveSvc} />
    </div>
  );
}