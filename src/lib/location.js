import Geolocation from '@react-native-community/geolocation';

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 0
};

export const getCurrentPosition = async () => {
  return new Promise((resolve, reject) => { Geolocation.getCurrentPosition(resolve, reject, GEOLOCATION_OPTIONS); });
}