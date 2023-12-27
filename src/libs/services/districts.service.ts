import axiosClient from '@interceptors/index';
import { AdsDistrict } from '@interfaces/ads-district';

const DistrictsService = {
  getAll: async (): Promise<AdsDistrict[]> => {
    const { data } = await axiosClient.get('/api/districts');
    return data.responseData;
  },

  create: async (payload: { name: string }): Promise<AdsDistrict> => {
    const { data } = await axiosClient.post('/api/districts', payload);
    return data.responseData;
  },

  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`/api/districts/${districtId}`);
  },
};

export default DistrictsService;
