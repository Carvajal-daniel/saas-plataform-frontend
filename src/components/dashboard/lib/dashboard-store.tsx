"use client";

import * as React from "react";

export type StaffStatus =
  | "Ativo"
  | "De Férias"
  | "Ausente"
  | "Inativo";

export interface Staff {
  id: string;
  name: string;
  role: string;
  status: StaffStatus;
  avatar?: string | null;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

export type AppointmentStatus =
  | "Marcado"
  | "Concluído"
  | "Cancelado";

export interface Appointment {
  id: string;
  client: string;
  service: string;
  staff: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  price: number;
}

export interface FinanceMonth {
  month: string;
  revenue: number;
  expenses: number;
  fixedCosts: number;
  variableCosts: number;
}

export interface Settings {
  profileName: string;
  businessName: string;
  phone: string;
  avatar: string | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface State {
  staff: Staff[];
  services: Service[];
  appointments: Appointment[];
  finance: FinanceMonth[];
  settings: Settings;
  notifications: Notification[];

  setStaff: React.Dispatch<
    React.SetStateAction<Staff[]>
  >;

  setServices: React.Dispatch<
    React.SetStateAction<Service[]>
  >;

  setAppointments: React.Dispatch<
    React.SetStateAction<Appointment[]>
  >;

  setSettings: React.Dispatch<
    React.SetStateAction<Settings>
  >;

  setNotifications: React.Dispatch<
    React.SetStateAction<Notification[]>
  >;

  dark: boolean;

  toggleDark: () => void;
}

const Ctx = React.createContext<State | null>(null);

const uid = () =>
  Math.random().toString(36).slice(2, 10);

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [staff, setStaff] = React.useState<Staff[]>([
    {
      id: uid(),
      name: "Mariana Silva",
      role: "Cabeleireira Sênior",
      status: "Ativo",
      avatar: null,
    },
    {
      id: uid(),
      name: "Rafael Costa",
      role: "Barbeiro",
      status: "Ativo",
      avatar: null,
    },
    {
      id: uid(),
      name: "Juliana Mendes",
      role: "Manicure",
      status: "De Férias",
      avatar: null,
    },
    {
      id: uid(),
      name: "Pedro Almeida",
      role: "Esteticista",
      status: "Ausente",
      avatar: null,
    },
  ]);

  const [services, setServices] =
    React.useState<Service[]>([
      {
        id: uid(),
        name: "Corte Feminino",
        price: 120,
        duration: 60,
        description:
          "Corte personalizado com finalização.",
      },
      {
        id: uid(),
        name: "Coloração",
        price: 280,
        duration: 120,
        description:
          "Coloração premium com produtos importados.",
      },
      {
        id: uid(),
        name: "Manicure",
        price: 65,
        duration: 45,
        description:
          "Esmaltação e tratamento de cutículas.",
      },
      {
        id: uid(),
        name: "Barba Premium",
        price: 80,
        duration: 40,
        description:
          "Barba completa com toalha quente.",
      },
    ]);

  const [appointments, setAppointments] =
    React.useState<Appointment[]>([
      {
        id: uid(),
        client: "Ana Beatriz",
        service: "Corte Feminino",
        staff: "Mariana Silva",
        date: "2026-05-18",
        time: "10:00",
        status: "Marcado",
        price: 120,
      },
      {
        id: uid(),
        client: "Carlos Eduardo",
        service: "Barba Premium",
        staff: "Rafael Costa",
        date: "2026-05-18",
        time: "11:30",
        status: "Marcado",
        price: 80,
      },
      {
        id: uid(),
        client: "Fernanda Lima",
        service: "Coloração",
        staff: "Mariana Silva",
        date: "2026-05-16",
        time: "14:00",
        status: "Concluído",
        price: 280,
      },
      {
        id: uid(),
        client: "Roberto Dias",
        service: "Manicure",
        staff: "Juliana Mendes",
        date: "2026-05-15",
        time: "16:00",
        status: "Cancelado",
        price: 65,
      },
      {
        id: uid(),
        client: "Patrícia Souza",
        service: "Corte Feminino",
        staff: "Mariana Silva",
        date: "2026-05-14",
        time: "09:00",
        status: "Concluído",
        price: 120,
      },
    ]);

  const [finance] =
    React.useState<FinanceMonth[]>([
      {
        month: "Jan",
        revenue: 18400,
        expenses: 9200,
        fixedCosts: 6000,
        variableCosts: 3200,
      },
      {
        month: "Fev",
        revenue: 21200,
        expenses: 10100,
        fixedCosts: 6000,
        variableCosts: 4100,
      },
      {
        month: "Mar",
        revenue: 24800,
        expenses: 11400,
        fixedCosts: 6200,
        variableCosts: 5200,
      },
      {
        month: "Abr",
        revenue: 22600,
        expenses: 10800,
        fixedCosts: 6200,
        variableCosts: 4600,
      },
      {
        month: "Mai",
        revenue: 28900,
        expenses: 12300,
        fixedCosts: 6400,
        variableCosts: 5900,
      },
      {
        month: "Jun",
        revenue: 31200,
        expenses: 13100,
        fixedCosts: 6400,
        variableCosts: 6700,
      },
    ]);

  const [settings, setSettings] =
    React.useState<Settings>({
      profileName: "Camila Ribeiro",
      businessName: "Meu Negócio",
      phone: "(11) 98765-4321",
      avatar: null,
    });

  const [notifications, setNotifications] =
    React.useState<Notification[]>([
      {
        id: uid(),
        title: "Novo agendamento",
        message:
          "Ana Beatriz marcou Corte Feminino para amanhã.",
        time: "há 5 min",
        read: false,
      },
      {
        id: uid(),
        title: "Pagamento recebido",
        message: "R$ 280,00 de Fernanda Lima.",
        time: "há 1 h",
        read: false,
      },
      {
        id: uid(),
        title: "Lembrete",
        message:
          "Reunião com equipe às 18h.",
        time: "há 3 h",
        read: true,
      },
    ]);

  const [dark, setDark] =
    React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      dark
    );
  }, [dark]);

  const value: State = {
    staff,
    services,
    appointments,
    finance,
    settings,
    notifications,

    setStaff,
    setServices,
    setAppointments,
    setSettings,
    setNotifications,

    dark,

    toggleDark: () =>
      setDark((d) => !d),
  };

  return (
    <Ctx.Provider value={value}>
      {children}
    </Ctx.Provider>
  );
}

export function useDashboard() {
  const v = React.useContext(Ctx);

  if (!v) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return v;
}

export const newId = uid;