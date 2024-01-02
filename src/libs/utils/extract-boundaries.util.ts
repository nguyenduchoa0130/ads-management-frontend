import { AdsLocation } from '@interfaces/ads-location';

const extractBoundariesUtil = (viewport: any): AdsLocation[] => {
  if (!viewport) {
    return [];
  }
  return [
    { lat: viewport.getSouthWest().lat(), lng: viewport.getSouthWest().lng() },
    { lat: viewport.getSouthWest().lat(), lng: viewport.getNorthEast().lng() },
    { lat: viewport.getNorthEast().lat(), lng: viewport.getNorthEast().lng() },
    { lat: viewport.getNorthEast().lat(), lng: viewport.getSouthWest().lng() },
  ];
};
export default extractBoundariesUtil;
