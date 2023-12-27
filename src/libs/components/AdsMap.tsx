import AlertType from '@enums/alert-type';
import { AdsLocation } from '@interfaces/ads-location';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import AlertService from '@services/alert.service';
import { FC, useCallback, useEffect, useState } from 'react';

interface AdsMapProps {}

const AdsMap: FC<AdsMapProps> = () => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState<AdsLocation>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_ACCESS_KEY,
  });

  const handleOnLoadMap = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const handleOnDestroyMap = useCallback((map) => {
    setMap(null);
  }, []);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCenter({ lat: latitude, lng: longitude });
          },
          (err) => {
            AlertService.showMessage(AlertType.Error, err.message);
          },
        );
      } else {
        const errorMessage = 'Trình duyệt của bạn không hỗ trợ định vị địa lý';
        AlertService.showMessage(AlertType.Error, errorMessage);
      }
    };

    getLocation();
  }, []);

  return (
    <>
      <div className='h-full w-full relative'>
        {isLoaded ? (
          <>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={30}
              onLoad={handleOnLoadMap}
              onUnmount={handleOnDestroyMap}
              mapContainerClassName='google-map'
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AdsMap;
