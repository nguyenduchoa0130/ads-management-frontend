import axiosClient from '@interceptors/index';
import { SpaceEditRequest } from '@interfaces/ads-space-edit-requests';



export const SpaceEditRequestService = {
  getAll: async (): Promise<SpaceEditRequest[]> => {
    const { data } = await axiosClient.get('api/space-edit-requests');
    return data.responseData;
  },

  create: async (payload: { }): Promise<SpaceEditRequest> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/space-edit-requests', payload);
    return data;
  },
  update: async (payload: SpaceEditRequest): Promise<SpaceEditRequest> => {
    const { data } = await axiosClient.put(`api/space-edit-requests/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/space-edit-requests/${districtId}`);
  },
};
