const findCoords = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
      const coords = {latitude: position.coords.latitude, longitude: position.coords.longitude};
      console.log(coords);
      return coords;
    }
  );
};

export default findCoords;