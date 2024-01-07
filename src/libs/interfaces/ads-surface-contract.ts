import { Company } from "./ads-company";
import { AdsSurface } from "./ads-surface";

// document.ts
export interface SurfaceContract {
  _id: string;
  surface: AdsSurface;
  content: string;
  company: string;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  state: number,
  email: string,
  phone: string,
  __v: number;
}
