import axiosClient from '@interceptors/index';
import { AdsType } from '@interfaces/ads-type';

const SpaceTypeService = {
  getAll: async (): Promise<AdsType[]> => {
    const { data } = await axiosClient.get('api/space-type');
    return data.responseData;
  },

  create: async (payload: { name: string }): Promise<AdsType> => {
    const { data } = await axiosClient.post('api/space-type', payload);
    return data.responseData;
  },

  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/space-type/${districtId}`);
  },
};

export default SpaceTypeService;
