
import axiosClient from '@interceptors/index';
import { SurfaceEditRequest } from '@interfaces/ads-surface-edit-request';


export const SurfaceEditRequestService = {
  getAll: async (): Promise<SurfaceEditRequest[]> => {
    const { data } = await axiosClient.get('api/surface-edit-requests');
    return data.responseData;
  },

  create: async (payload: SurfaceEditRequest): Promise<SurfaceEditRequest> => {
    delete payload['_id'];
    const { data } = await axiosClient.postForm('api/surface-edit-requests', payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  update: async (payload:SurfaceEditRequest): Promise<SurfaceEditRequest> => {
    const { data } = await axiosClient.putForm(`api/surface-edit-requests/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/surface-edit-requests/${districtId}`);
  },
};
