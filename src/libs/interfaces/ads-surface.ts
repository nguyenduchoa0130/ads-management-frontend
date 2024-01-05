import { AdsSpace } from "./ads-space";
import { AdsType } from "./ads-type";

export interface AdsSurface {
  _id: string;
  long: number;
  lat: number;
  width: number;
  height: number;
  img_url: string;
  type: AdsType;
  space:AdsSpace;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
