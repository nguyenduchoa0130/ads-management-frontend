import axiosClient from '@interceptors/index';
import { User } from '@interfaces/user';


export const AuthService = {
 

  login: async (payload: User): Promise<any> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/login', payload);
    return data;
  },
  verifyUsername: async (payload: User): Promise<any> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/verify-username', payload);
    return data;
  },
  resetPassword: async (payload: User): Promise<any> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/reset-password', payload);
    return data;
  },
 
};
