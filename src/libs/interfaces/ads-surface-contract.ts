import { Company } from "./ads-company";
import { AdsSurface } from "./ads-surface";

// document.ts
export interface SurfaceContract {
  _id: string;
  surface: AdsSurface;
  content: string;
  company: Company;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
