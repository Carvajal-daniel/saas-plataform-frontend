import * as React from "react";

export type AppointmentStatus =
  | "Marcado"
  | "Concluído"
  | "Cancelado";

export type StaffStatus =
  | "Ativo"
  | "De Férias"
  | "Ausente"
  | "Inativo";

export interface Appointment {
  id: string;
  client: string;
  service: string;
  staff: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  price: number;
  commissionEarned?: number;
  notes?: string;
  paid?: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  status: StaffStatus;
  commissionRate: number;
  avatarUrl?: string;
  daysOff: number[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  imageUrl?: string;
}

export interface BusinessConfig {
  name: string;
  logoUrl: string | null;
  phone: string;
  closedDays: number[];
  openTime?: string;
  closeTime?: string;
}

export type NotificationType =
  | "appointment"
  | "financial";

export interface AppNotification {
  id: string;
  text: string;
  type: NotificationType;
  targetId?: string;
  read: boolean;
  createdAt: number;
}

export type TabKey =
  | "overview"
  | "appointments"
  | "financial"
  | "management"
  | "settings";

// GLOBAL SEARCH
export interface SearchResult {
  id: string;

  type:
    | "appointment"
    | "service"
    | "staff";

  title: string;

  subtitle?: string;
}

interface Ctx {
  business: BusinessConfig;

  setBusiness: React.Dispatch<
    React.SetStateAction<BusinessConfig>
  >;

  appointments: Appointment[];

  setAppointments: React.Dispatch<
    React.SetStateAction<Appointment[]>
  >;

  staff: Staff[];

  setStaff: React.Dispatch<
    React.SetStateAction<Staff[]>
  >;

  services: Service[];

  setServices: React.Dispatch<
    React.SetStateAction<Service[]>
  >;

  notifications: AppNotification[];

  // SEARCH
  search: string;

  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;

  globalSearch: (
    query: string
  ) => SearchResult[];

  pushNotification: (
    n: Omit<
      AppNotification,
      "id" | "read" | "createdAt"
    >
  ) => void;

  markNotificationRead: (
    id: string
  ) => void;

  markAllRead: () => void;

  activeTab: TabKey;

  setActiveTab: (
    t: TabKey
  ) => void;

  focusedAppointmentId: string | null;

  setFocusedAppointmentId: (
    id: string | null
  ) => void;

  navigateTo: (
    tab: TabKey,
    opts?: {
      appointmentId?: string;
    }
  ) => void;
}

export const newId = () =>
  Math.random()
    .toString(36)
    .slice(2, 10);

const DashboardCtx =
  React.createContext<Ctx | null>(
    null
  );

const todayStr = () =>
  new Date()
    .toISOString()
    .slice(0, 10);

const dateOffset = (
  days: number
) => {
  const d = new Date();

  d.setDate(
    d.getDate() + days
  );

  return d
    .toISOString()
    .slice(0, 10);
};

const seedStaff: Staff[] = [
  {
    id: "s1",
    name: "Ana Costa",
    role: "Cabeleireira Sênior",
    status: "Ativo",
    commissionRate: 40,
    daysOff: [0],
    avatarUrl:
      "https://i.pravatar.cc/120?img=47",
  },

  {
    id: "s2",
    name: "Bruno Lima",
    role: "Barbeiro",
    status: "Ativo",
    commissionRate: 35,
    daysOff: [0, 1],
    avatarUrl:
      "https://i.pravatar.cc/120?img=12",
  },

  {
    id: "s3",
    name: "Carla Souza",
    role: "Manicure",
    status: "De Férias",
    commissionRate: 30,
    daysOff: [0],
    avatarUrl:
      "https://i.pravatar.cc/120?img=32",
  },
];

const seedServices: Service[] = [
  {
    id: "sv1",
    name: "Corte Feminino",
    price: 90,
    duration: 60,
    description:
      "Corte, lavagem e finalização",
  },

  {
    id: "sv2",
    name: "Corte Masculino",
    price: 50,
    duration: 30,
    description:
      "Corte clássico ou degradê",
  },

  {
    id: "sv3",
    name: "Coloração",
    price: 220,
    duration: 120,
    description:
      "Coloração completa com hidratação",
  },

  {
    id: "sv4",
    name: "Manicure",
    price: 45,
    duration: 45,
    description: "Mãos e cutículas",
  },
];

const seedAppointments: Appointment[] =
  [
    {
      id: newId(),
      client: "Maria Silva",
      service:
        "Corte Feminino",
      staff: "Ana Costa",
      date: todayStr(),
      time: "10:00",
      status: "Marcado",
      price: 90,
    },

    {
      id: newId(),
      client: "João Pereira",
      service:
        "Corte Masculino",
      staff: "Bruno Lima",
      date: todayStr(),
      time: "14:30",
      status: "Concluído",
      price: 50,
      commissionEarned: 17.5,
    },

    {
      id: newId(),
      client: "Fernanda Reis",
      service:
        "Coloração",
      staff: "Ana Costa",
      date: dateOffset(1),
      time: "09:00",
      status: "Marcado",
      price: 220,
    },

    {
      id: newId(),
      client: "Pedro Alves",
      service:
        "Corte Masculino",
      staff: "Bruno Lima",
      date: dateOffset(-1),
      time: "16:00",
      status: "Concluído",
      price: 50,
      commissionEarned: 17.5,
    },

    {
      id: newId(),
      client: "Luiza Mendes",
      service:
        "Manicure",
      staff: "Carla Souza",
      date: dateOffset(-3),
      time: "11:00",
      status: "Concluído",
      price: 45,
      commissionEarned: 13.5,
    },

    {
      id: newId(),
      client: "Carlos Dias",
      service:
        "Corte Masculino",
      staff: "Bruno Lima",
      date: dateOffset(-2),
      time: "15:00",
      status: "Cancelado",
      price: 50,
    },
  ];

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [business, setBusiness] =
    React.useState<BusinessConfig>({
      name: "Altair Studio",
      logoUrl: null,
      phone:
        "(85) 99999-9999",
      closedDays: [0],
    });

  const [
    appointments,
    setAppointments,
  ] = React.useState<
    Appointment[]
  >(seedAppointments);

  const [staff, setStaff] =
    React.useState<Staff[]>(
      seedStaff
    );

  const [services, setServices] =
    React.useState<Service[]>(
      seedServices
    );

  const [
    notifications,
    setNotifications,
  ] = React.useState<
    AppNotification[]
  >([
    {
      id: newId(),
      text: "Bem-vindo ao Altair — seu painel está pronto.",
      type: "appointment",
      read: false,
      createdAt:
        Date.now() - 60000,
    },
  ]);

  const [activeTab, setActiveTab] =
    React.useState<TabKey>(
      "overview"
    );

  const [
    focusedAppointmentId,
    setFocusedAppointmentId,
  ] = React.useState<
    string | null
  >(null);

  // SEARCH
  const [search, setSearch] =
    React.useState("");

  // GLOBAL SEARCH
  const globalSearch: Ctx["globalSearch"] =
    (query) => {
      const q =
        query.toLowerCase();

      const results: SearchResult[] =
        [];

      appointments.forEach(
        (a) => {
          if (
            a.client
              .toLowerCase()
              .includes(q) ||
            a.service
              .toLowerCase()
              .includes(q) ||
            a.staff
              .toLowerCase()
              .includes(q)
          ) {
            results.push({
              id: a.id,

              type:
                "appointment",

              title: a.client,

              subtitle: `${a.service} • ${a.date}`,
            });
          }
        }
      );

      services.forEach(
        (s) => {
          if (
            s.name
              .toLowerCase()
              .includes(q)
          ) {
            results.push({
              id: s.id,

              type: "service",

              title: s.name,

              subtitle:
                fmtBRL(s.price),
            });
          }
        }
      );

      staff.forEach((s) => {
        if (
          s.name
            .toLowerCase()
            .includes(q)
        ) {
          results.push({
            id: s.id,

            type: "staff",

            title: s.name,

            subtitle: s.role,
          });
        }
      });

      return results;
    };

  const pushNotification: Ctx["pushNotification"] =
    (n) => {
      setNotifications(
        (arr) => [
          {
            ...n,
            id: newId(),
            read: false,
            createdAt:
              Date.now(),
          },

          ...arr,
        ]
      );
    };

  const markNotificationRead =
    (id: string) =>
      setNotifications((arr) =>
        arr.map((n) =>
          n.id === id
            ? {
                ...n,
                read: true,
              }
            : n
        )
      );

  const markAllRead = () =>
    setNotifications((arr) =>
      arr.map((n) => ({
        ...n,
        read: true,
      }))
    );

  const navigateTo: Ctx["navigateTo"] =
    (tab, opts) => {
      setActiveTab(tab);

      if (
        opts?.appointmentId
      ) {
        setFocusedAppointmentId(
          opts.appointmentId
        );
      }
    };

  const value: Ctx = {
    business,
    setBusiness,

    appointments,
    setAppointments,

    staff,
    setStaff,

    services,
    setServices,

    notifications,

    search,
    setSearch,

    globalSearch,

    pushNotification,

    markNotificationRead,

    markAllRead,

    activeTab,
    setActiveTab,

    focusedAppointmentId,
    setFocusedAppointmentId,

    navigateTo,
  };

  return (
    <DashboardCtx.Provider
      value={value}
    >
      {children}
    </DashboardCtx.Provider>
  );
}

export function useDashboard() {
  const ctx =
    React.useContext(
      DashboardCtx
    );

  if (!ctx) {
    throw new Error(
      "useDashboard must be used within DashboardProvider"
    );
  }

  return ctx;
}

export const fmtBRL = (
  n: number
) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });