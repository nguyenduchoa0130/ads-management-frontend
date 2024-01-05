import axiosClient from '@interceptors/index';
import { AdsSpace as Space } from '@interfaces/ads-space';


export const SpaceService = {
  getAll: async (): Promise<Space[]> => {
    const { data } = await axiosClient.get('api/spaces');
    return data.responseData;
  },

  create: async (payload: { }): Promise<Space> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/spaces', payload);
    return data;
  },
  update: async (payload: { _id:string}): Promise<Space> => {
    const { data } = await axiosClient.patch(`api/spaces/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/spaces/${districtId}`);
  },
};
