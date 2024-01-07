export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  birthday: Date,
  phone:string,
  role: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  create_by: User;
  update_by:User;
  access_token?: string;
  otp: number;
  __v: number;
}