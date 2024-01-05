// reportForm.ts
export interface Report {
  _id: string;
  surface: string;
  report_date: string;
  content: string;
  email: string;
  phone: string;
  state: number;
  img_url_1: string;
  img_url_2: string;
  reporter: string;
  report_format: string;
  createdAt?: string;
  updatedAt?: string;
  __v: number;
}
