export interface Surface {
  _id: string;
  long: string;
  lat: string;
  width: number;
  height: number;
  img_url: string;
  type?: string;
  space?:string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
