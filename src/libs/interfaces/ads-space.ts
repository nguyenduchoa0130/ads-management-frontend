import { AdsType } from "./ads-type";
import { AdsWard } from "./ads-ward";

// spaces.ts
export interface AdsSpace {
  _id: string;
  long: string;
  lat: string;
  address: string;
  type: AdsType;
  format: AdsType;
  ward: AdsWard;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
