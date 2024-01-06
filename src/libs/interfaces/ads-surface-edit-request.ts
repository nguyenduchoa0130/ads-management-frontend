import { AdsSpace } from "./ads-space";
import { AdsSurface } from "./ads-surface";
import { AdsType } from "./ads-type";

// surfaceEditRequest.ts
export interface SurfaceEditRequest {
  _id: string;
  long: number;
  lat: number;
  width: number;
  height: number;
  img_url: string;
  reason: string;
  state: number;
  type: AdsType;
  surface:AdsSurface ;
  space: AdsSpace;
  request_date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
