"use client";

import * as React from "react";
import { LogOut, Upload, Building2, Phone, Sparkles, Sun, Moon, Clock } from "lucide-react";
import { Field, inputCls } from "./Modal";
import { toast } from "sonner";
import { useDashboard } from "../lib/dashboard-store";
import { Button } from "@/components/ui/Button";
import { cn } from "@/features/lib/utils";

const WD = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Geração de horários de 30 em 30 minutos (00:00 às 23:30) para o select de funcionamento
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor((i * 30) / 60)).padStart(2, "0");
  const m = String((i * 30) % 60).padStart(2, "0");
  return `${h}:${m}`;
});

export function SettingsTab() {
  const { business, setBusiness } = useDashboard();
  const [name, setName] = React.useState(business.name);
  const [phone, setPhone] = React.useState(business.phone);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(business.logoUrl);
  const [closedDays, setClosedDays] = React.useState<number[]>(business.closedDays);
  
  // Estados para os horários de início e fim da jornada do estabelecimento
  const [openTime, setOpenTime] = React.useState(business.openTime ?? "08:00");
  const [closeTime, setCloseTime] = React.useState(business.closeTime ?? "20:00");
  
  const fileRef = React.useRef<HTMLInputElement>(null);

  const dark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const [isDark, setIsDark] = React.useState(dark);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((d) => !d);
  };

  const onFile = (f: File) => {
    const r = new FileReader();
    r.onload = (e) => setLogoUrl(String(e.target?.result ?? ""));
    r.readAsDataURL(f);
  };

  const save = () => {
    // Validação básica para evitar que o horário de fechamento seja menor ou igual ao de abertura
    if (openTime >= closeTime) {
      toast.error("O horário de fechamento deve ser maior que o horário de abertura.");
      return;
    }

    setBusiness({ 
      name: name.trim() || "Meu Negócio", 
      phone, 
      logoUrl, 
      closedDays,
      openTime,
      closeTime
    });
    toast.success("Configurações salvas com sucesso!");
  };

  const toggleDay = (d: number) => setClosedDays((arr) => (arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d].sort()));

 

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-1 w-full btn-primary-gradient" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={16} className="text-primary" />
            <h3 className="text-sm font-bold text-foreground">Identidade do Negócio</h3>
          </div>

          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-muted overflow-hidden flex items-center justify-center border border-border shrink-0">
              {logoUrl ? <img src={logoUrl} alt="" className="w-full h-full object-cover" /> : <Sparkles size={22} className="text-muted-foreground" />}
            </div>
            <div className="flex-1 space-y-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 px-3.5 py-2 h-auto text-xs font-semibold">
                  <Upload size={13} /> Enviar logo
                </Button>
                {logoUrl && <Button variant="ghost" onClick={() => setLogoUrl(null)} className="px-3.5 py-2 h-auto text-xs text-muted-foreground hover:text-rose-500">Remover</Button>}
              </div>
              <p className="text-[11px] text-muted-foreground">PNG ou JPG. A logo aparece no menu lateral e no topo do app.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nome do Negócio">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Altair Studio" />
            </Field>
            <Field label="Telefone">
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input className={cn(inputCls, "pl-9")} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" />
              </div>
            </Field>
          </div>

          {/* Seção Nova: Seleção de Horários de Trabalho */}
          <div className="mt-5 border-t border-border/60 pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-muted-foreground" />
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Horário de Funcionamento Geral</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Abertura">
                <select className={inputCls} value={openTime} onChange={(e) => setOpenTime(e.target.value)}>
                  {TIME_OPTIONS.map((time) => (
                    <option key={`open-${time}`} value={time}>{time}</option>
                  ))}
                </select>
              </Field>
              <Field label="Fechamento">
                <select className={inputCls} value={closeTime} onChange={(e) => setCloseTime(e.target.value)}>
                  {TIME_OPTIONS.map((time) => (
                    <option key={`close-${time}`} value={time}>{time}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className="mt-5 border-t border-border/60 pt-5">
            <Field label="Dias em que o estabelecimento NÃO funciona">
              <div className="flex flex-wrap gap-2">
                {WD.map((d, i) => (
                  <button key={d} type="button" onClick={() => toggleDay(i)} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all", closedDays.includes(i) ? "btn-primary-gradient border-none text-white" : "border-border bg-card text-muted-foreground hover:border-primary/40")}>
                    {d}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Button type="button" onClick={save} className="mt-6 btn-primary-gradient px-5 py-2.5 h-auto text-sm font-semibold text-white">
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">Aparência</p>
          <p className="text-[11px] text-muted-foreground">Alterne entre modo claro e escuro</p>
        </div>
        <Button variant="outline" onClick={toggleDark} className="inline-flex items-center gap-2 px-4 py-2 h-auto text-sm font-semibold">
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          {isDark ? "Modo Claro" : "Modo Escuro"}
        </Button>
      </div>

     
    </div>
  );
}