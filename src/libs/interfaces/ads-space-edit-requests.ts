// entity1.ts
export interface SpaceEditRequest {
  _id: string;
  long: string;
  lat: string;
  address: string;
  reason: string;
  type: string | object; // Assuming type, format, ward, space are represented as strings
  format: string | object;
  ward: string | object;
  space: string | object;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
