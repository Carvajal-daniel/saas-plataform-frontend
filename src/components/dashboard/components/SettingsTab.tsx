import * as React from "react";
import { Camera, Check } from "lucide-react";
import { Field, inputCls } from "./Modal";
import { useDashboard } from "../lib/dashboard-store";
import { Button } from "@/components/ui/Button";

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) => [a && `(${a}`, a.length === 2 && ") ", b, c && `-${c}`].filter(Boolean).join(""));
  return d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
}

export function SettingsTab() {
  const { settings, setSettings } = useDashboard();
  const [form, setForm] = React.useState(settings);
  const [saved, setSaved] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setForm(s => ({ ...s, avatar: reader.result as string }));
    reader.readAsDataURL(f);
  };

  const save = () => {
    setSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie seu perfil e dados do negócio.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-1">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Foto de perfil</h3>
          <p className="text-xs text-muted-foreground">Imagem exibida no cabeçalho.</p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full btn-primary-gradient text-2xl font-semibold text-white shadow-xl">
                {form.avatar
                  ? <img src={form.avatar} alt="avatar" className="h-full w-full object-cover" />
                  : form.profileName.split(" ").map(s => s[0]).slice(0, 2).join("")}
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-card bg-foreground text-background shadow-lg transition-transform hover:scale-110">
                <Camera className="h-4 w-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            </div>
            {form.avatar && <button onClick={() => setForm(s => ({ ...s, avatar: null }))} className="text-xs text-muted-foreground hover:text-foreground">Remover foto</button>}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Informações</h3>
          <p className="text-xs text-muted-foreground">Estes dados aparecem em todo o painel.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome do perfil"><input className={inputCls} value={form.profileName} onChange={e => setForm({ ...form, profileName: e.target.value })} /></Field>
            <Field label="Nome da empresa"><input className={inputCls} value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} /></Field>
            <Field label="Telefone"><input className={inputCls} value={form.phone} onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })} placeholder="(11) 98765-4321" /></Field>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setForm(settings)}>Descartar</Button>
            <Button onClick={save} className="btn-primary-gradient h-10 px-6">
              {saved ? <><Check className="h-4 w-4" /> Salvo!</> : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
