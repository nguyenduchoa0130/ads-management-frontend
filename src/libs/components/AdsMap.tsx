import { AimOutlined, SearchOutlined } from "@ant-design/icons";
import AlertType from "@enums/alert-type";
import { AdsLocation } from "@interfaces/ads-location";
import {
  Autocomplete,
  GoogleMap,
  Marker,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import AlertService from "@services/alert.service";
import extractBoundariesUtil from "@utils/extract-boundaries.util";
import { Button, Input, Tooltip } from "antd";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { OutputFormat, fromLatLng, setDefaults } from "react-geocode";

setDefaults({
  key: process.env.REACT_APP_GOOGLE_MAP_ACCESS_KEY,
  language: "vi",
  outputFormat: OutputFormat.JSON,
});
interface AdsMapProps {
  zoom?: number;
  isEnableSearch?: boolean;
  isHomePage?: boolean;
  onSearchAddress?: () => any;
  onClickOnMap?: (data: AdsLocation) => any;
  lngLat?: AdsLocation;
}

const AdsMap: FC<AdsMapProps> = ({
  zoom = 13,
  isHomePage = false,
  isEnableSearch = true,
  onClickOnMap = (data: AdsLocation) => {},
  onSearchAddress = (data: AdsLocation) => {},
  lngLat = null,
}) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState<AdsLocation>(null);
  const [defaultCenter, setDefaultCenter] = useState<AdsLocation>(null);
  const [address, setAddress] = useState<string>("");
  const [bounds, setBounds] = useState<AdsLocation[]>([]);
  const autocompleteRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_ACCESS_KEY,
    language: "vi",
    libraries: ["geocoding", "marker", "geometry", "drawing", "places"],
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
        }
      );
    } else {
      const errorMessage = "Trình duyệt của bạn không hỗ trợ định vị địa lý";
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
          setBounds(extractBoundariesUtil(placeDetails.geometry.viewport));
          onSearchAddress({ lat: location.lat(), lng: location.lng() });
        }
      }
    );
  };

  const handleClickOnMap = async (locationInfo) => {
    const lat = locationInfo.latLng.lat();
    const lng = locationInfo.latLng.lng();
    const { results, status } = await fromLatLng(lat, lng);
    if (status === "OK") {
      const [placeDetails] = results;
      const location = placeDetails.geometry.location;

      onClickOnMap({
        lat: location.lat,
        lng: location.lng,
        addressDetail: results,
      });
    } else {
      AlertService.showMessage(
        AlertType.Error,
        "Có lỗi trong quá trình tìm kiếm địa chỉ"
      );
    }
  };

  return (
    <>
      <div className="h-full w-full relative">
        {isLoaded ? (
          <>
            {isEnableSearch && (
              <div
                className={`absolute top-2 z-10 ${
                  isHomePage ? "left-16" : "left-4"
                }`}
              >
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                    autocomplete.setFields(["place_id", "formatted_address"]);
                  }}
                  onPlaceChanged={() => {
                    const selectedPlace = autocompleteRef.current.getPlace();
                    handlePlaceSelect(selectedPlace);
                  }}
                >
                  <div className="relative flex items-center justify-start gap-2 w-[500px]">
                    <span className="absolute left-4 z-10">
                      <SearchOutlined />
                    </span>
                    <Input
                      size="large"
                      placeholder="Tìm kiếm địa chỉ"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-10"
                    />
                    <Tooltip title="Vị trí hiện tại">
                      <Button
                        size="large"
                        icon={<AimOutlined />}
                        shape="circle"
                        onClick={() => setCenter({ ...defaultCenter })}
                      />
                    </Tooltip>
                  </div>
                </Autocomplete>
              </div>
            )}
            <GoogleMap
              zoom={zoom}
              center={center}
              mapContainerClassName="google-map"
              mapContainerStyle={{ width: "100%", height: "100%" }}
              onLoad={handleOnLoadMap}
              onClick={handleClickOnMap}
              onUnmount={handleOnDestroyMap}
              options={{
                styles: [
                  {
                    featureType: "all",
                    elementType: "labels.text",
                    stylers: [
                      {
                        visibility: "off",
                      },
                    ],
                  },
                  {
                    featureType: "poi",
                    elementType: "labels.icon",
                    stylers: [
                      {
                        visibility: "off",
                      },
                    ],
                  },
                ],
              }}
            >
              <>
                {center && (
                  <Marker
                    draggable
                    position={center}
                    onDragEnd={console.log}
                  ></Marker>
                )}
                {bounds.length && (
                  <>
                    <Polygon
                      path={bounds}
                      options={{
                        fillColor: "#87CEFA",
                        fillOpacity: 0,
                        strokeColor: "#FFA07A",
                        strokeOpacity: 1,
                        strokeWeight: 2,
                      }}
                    />
                  </>
                )}
              </>
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
