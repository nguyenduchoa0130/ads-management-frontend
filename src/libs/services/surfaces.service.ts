import { Surface } from '@interfaces/ads-surface';
import axiosClient from '@interceptors/index';


export const SurfaceService = {
  getAll: async (): Promise<Surface[]> => {
    const { data } = await axiosClient.get('api/surfaces');
    return data.responseData;
  },

  create: async (payload: { name: string }): Promise<Surface> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/surfaces', payload);
    return data;
  },
  update: async (payload: { name: string , _id: string}): Promise<Surface> => {
    const { data } = await axiosClient.put(`api/surfaces/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/surfaces/${districtId}`);
  },
};
