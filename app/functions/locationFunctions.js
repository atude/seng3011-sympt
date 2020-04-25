import { GOOGLE_API_KEY } from 'react-native-dotenv';

export const getCoordinates = () => {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getPostcodeFromCoords = async () => {
  const position = await getCoordinates();
  const coords = position.coords.latitude + "," + position.coords.longitude;
  // console.log(coords);
  try {
    let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords}&key=${GOOGLE_API_KEY}&result_type=postal_code`);
    response = await response.json();
    return response;
  } catch (error) {
    console.warn(error);
  }

  return null;
};
