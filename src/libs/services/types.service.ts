import axiosClient from '@interceptors/index';
import { AdsType } from '@interfaces/ads-type';

const SpaceTypeService = {
  getAll: async (): Promise<AdsType[]> => {
    const { data } = await axiosClient.get('api/space-type');
    return data.responseData;
  },

  create: async (payload: { name: string }): Promise<AdsType> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/space-type', payload);
    return data;
  },
  update: async (payload: { name: string , _id: string}): Promise<AdsType> => {
    const { data } = await axiosClient.patch(`api/space-type/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/space-type/${districtId}`);
  },
};

const SurfaceTypeService = {
  getAll: async (): Promise<AdsType[]> => {
    const { data } = await axiosClient.get('api/surface-type');
    return data.responseData;
  },

  create: async (payload: { name: string }): Promise<AdsType> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/surface-type', payload);
    return data;
  },
  update: async (payload: { name: string , _id: string}): Promise<AdsType> => {
    const { data } = await axiosClient.patch(`api/surface-type/${payload._id}`, payload);
    return data;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/surface-type/${districtId}`);
  },
};

const ReportFormatService = {
  getAll: async (): Promise<AdsType[]> => {
    const { data } = await axiosClient.get('api/report-format');
    return data.responseData;
  },

  create: async (payload: { name: string }): Promise<AdsType> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/report-format', payload);
    return data.responseData;
  },
  update: async (payload: { name: string , _id: string}): Promise<AdsType> => {
    const { data } = await axiosClient.patch(`api/report-format/${payload._id}`, payload);
    return data.responseData;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/report-format/${districtId}`);
  },
};

const SpaceFormatService = {
  getAll: async (): Promise<AdsType[]> => {
    const { data } = await axiosClient.get('api/space-format');
    return data.responseData;
  },

  create: async (payload: { name: string }): Promise<AdsType> => {
    delete payload['_id'];
    const { data } = await axiosClient.post('api/space-format', payload);
    return data.responseData;
  },
  update: async (payload: { name: string , _id: string}): Promise<AdsType> => {
    const { data } = await axiosClient.patch(`api/space-format/${payload._id}`, payload);
    return data.responseData;
  },
  remove: async (districtId: string): Promise<void> => {
    await axiosClient.delete(`api/space-format/${districtId}`);
  },
};
export  {SpaceFormatService, ReportFormatService, SurfaceTypeService, SpaceTypeService};
