import { AdsSpace } from "./ads-space";
import { AdsType } from "./ads-type";
import { AdsWard } from "./ads-ward";

// entity1.ts
export interface SpaceEditRequest {
  _id: string;
  long: string;
  lat: string;
  request_date:Date,
  address: string;
  reason: string;
  type: AdsType; // Assuming type, format, ward, space are represented as strings
  format: AdsType;
  ward: AdsWard;
  space: AdsSpace;
  state: number,
  createdAt: string;
  updatedAt: string;
  __v: number;
}
