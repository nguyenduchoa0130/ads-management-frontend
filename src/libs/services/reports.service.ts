import { AdsSurface } from '@interfaces/ads-surface';
import axiosClient from '@interceptors/index';
import { Report } from '@interfaces/ads-report';


export const ReportService = {
  getAll: async (): Promise<Report[]> => {
    const { data } = await axiosClient.get('api/reports');
    return data.responseData;
  },

  create: async (payload: Report): Promise<Report> => {
    delete payload['_id'];
    const { data } = await axiosClient.postForm('api/reports', payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  update: async (payload:Report): Promise<Report> => {
    const { data } = await axiosClient.patchForm(`api/reports/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/reports/${districtId}`);
  },
};
