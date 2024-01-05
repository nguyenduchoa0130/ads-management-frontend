import axiosClient from '@interceptors/index';
import { AdsWard } from '@interfaces/ads-ward';



export const WardService = {
  getAll: async (): Promise<AdsWard[]> => {
    const { data } = await axiosClient.get('api/wards');
    return data.responseData;
  },

  create: async (payload: { }): Promise<AdsWard> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/wards', payload);
    return data;
  },
  update: async (payload: { _id:string}): Promise<AdsWard> => {
    const { data } = await axiosClient.put(`api/wards/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/wards/${districtId}`);
  },
};
