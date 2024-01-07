import { AdsSurface } from '@interfaces/ads-surface';
import axiosClient from '@interceptors/index';
import { Report } from '@interfaces/ads-report';
import { SpaceContract } from '@interfaces/ads-space-contract';
import { SurfaceContract } from '@interfaces/ads-surface-contract';


export const SpaceContractService = {
  getAll: async (): Promise<SpaceContract[]> => {
    const { data } = await axiosClient.get('api/space-contracts');
    return data.responseData;
  },

  create: async (payload: SpaceContract): Promise<SpaceContract> => {
    delete payload['_id'];
    const { data } = await axiosClient.postForm('api/space-contracts', payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  update: async (payload:SpaceContract): Promise<SpaceContract> => {
    const { data } = await axiosClient.putForm(`api/space-contracts/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/space-contracts/${districtId}`);
  },
};
export const SurfaceContractService = {
  getAll: async (): Promise<SurfaceContract[]> => {
    const { data } = await axiosClient.get('api/surface-contracts');
    return data.responseData;
  },

  create: async (payload: SurfaceContract): Promise<SurfaceContract> => {
    delete payload['_id'];
    const { data } = await axiosClient.postForm('api/surface-contracts', payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  update: async (payload:SurfaceContract): Promise<SurfaceContract> => {
    const { data } = await axiosClient.putForm(`api/surface-contracts/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<any> => {
    const {data }  = await axiosClient.delete(`api/surface-contracts/${districtId}`);
    return data;
  },
};
