import { LucideIcon } from "lucide-react";

export interface Plan {
  name: string;
  topColor: string;
  annual: string;
  monthly: string;
  sub: string;
  cta: string;
  primary: boolean;
  features: string[];
  highlighted: boolean;
  custom?: boolean;
}

export interface TrustItem {
  Icon: LucideIcon;
  label: string;
}