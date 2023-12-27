import { AimOutlined, SearchOutlined } from '@ant-design/icons';
import AlertType from '@enums/alert-type';
import { AdsLocation } from '@interfaces/ads-location';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import AlertService from '@services/alert.service';
import { Button, Input, Tooltip } from 'antd';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface AdsMapProps {
  onLocationChange?: (location: AdsLocation) => any;
}

const AdsMap: FC<AdsMapProps> = ({ onLocationChange = (_) => {} }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState<AdsLocation>(null);
  const [defaultCenter, setDefaultCenter] = useState<AdsLocation>(null);
  const [address, setAddress] = useState<string>('');
  const autocompleteRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_ACCESS_KEY,
    language: 'vi',
    libraries: ['geocoding', 'marker', 'geometry', 'drawing', 'places'],
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setDefaultCenter({ lat: latitude, lng: longitude });
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

  const handleOnLoadMap = useCallback((map) => {
    setMap(map);
    getCurrentLocation();
  }, []);

  const handleOnDestroyMap = useCallback((map) => {
    setMap(null);
  }, []);

  const handlePlaceSelect = (place) => {
    setAddress(place.formatted_address);

    const service = new window.google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: place.place_id,
      },
      (placeDetails, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const location = placeDetails.geometry.location;
          setCenter({ lat: location.lat(), lng: location.lng() });
        }
      },
    );
  };

  useEffect(() => {
    onLocationChange(center);
  }, [center]);

  return (
    <>
      <div className='h-full w-full relative'>
        {isLoaded ? (
          <>
            <div className='absolute top-2 z-10 left-16'>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocompleteRef.current = autocomplete;
                  autocomplete.setFields(['place_id', 'formatted_address']);
                }}
                onPlaceChanged={() => {
                  const selectedPlace = autocompleteRef.current.getPlace();
                  handlePlaceSelect(selectedPlace);
                }}>
                <div className='relative flex items-center justify-start gap-2 w-[500px]'>
                  <span className='absolute left-4 z-10'>
                    <SearchOutlined />
                  </span>
                  <Input
                    size='large'
                    placeholder='Tìm kiếm địa chỉ'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className='pl-10'
                  />
                  <Tooltip title='Vị trí hiện tại'>
                    <Button
                      size='large'
                      icon={<AimOutlined />}
                      shape='circle'
                      onClick={() => setCenter({ ...defaultCenter })}
                    />
                  </Tooltip>
                </div>
              </Autocomplete>
            </div>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={center}
              zoom={20}
              onLoad={handleOnLoadMap}
              onUnmount={handleOnDestroyMap}
              mapContainerClassName='google-map'>
              <>{center && <Marker position={center} />}</>
            </GoogleMap>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AdsMap;
