import { AdsSpace } from "./ads-space";
import { AdsSurface } from "./ads-surface";
import { AdsType } from "./ads-type";

// reportForm.ts
export interface Report {
  _id: string;
  surface: AdsSurface;
  space: AdsSpace;
  object: string;
  type: number;
  report_date: Date;
  content: string;
  email: string;
  phone: string;
  state: number;
  img_url_1: string;
  img_url_2: string;
  reporter: string;
  report_format: AdsType;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}
