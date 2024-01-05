import { AdsSurface } from '@interfaces/ads-surface';
import axiosClient from '@interceptors/index';


export const SurfaceService = {
  getAll: async (): Promise<AdsSurface[]> => {
    const { data } = await axiosClient.get('api/surfaces');
    return data.responseData;
  },

  create: async (payload: AdsSurface): Promise<AdsSurface> => {
    delete payload['_id'];
    const { data } = await axiosClient.postForm('api/surfaces', payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  update: async (payload:AdsSurface): Promise<AdsSurface> => {
    const { data } = await axiosClient.patchForm(`api/surfaces/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/surfaces/${districtId}`);
  },
};
