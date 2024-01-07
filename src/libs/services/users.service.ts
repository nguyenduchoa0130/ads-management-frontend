import { AdsSurface } from '@interfaces/ads-surface';
import axiosClient from '@interceptors/index';
import { User } from '@interfaces/user';


export const UserService = {
  getAll: async (): Promise<any[]> => {
    const { data } = await axiosClient.get('api/users');
    return data.responseData;
  },

  create: async (payload: User): Promise<any> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/users', payload);
    return data;
  },
  update: async (payload:User): Promise<any> => {
    const { data } = await axiosClient.patch(`api/users/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/users/${districtId}`);
  },
};
