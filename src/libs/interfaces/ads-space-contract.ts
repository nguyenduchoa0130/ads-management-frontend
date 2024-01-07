import { Company } from "./ads-company";
import { AdsSpace } from "./ads-space";

// document.ts
export interface SpaceContract {
  _id: string;
  space: AdsSpace;
  content: string;
  company: Company;
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
