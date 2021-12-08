const objMap = (obj, func) => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
};

const landmarkToCoordinates = (data, width, height) => {
  return (landmark) => {
    const coordinates = Object.assign({}, data[landmark]);
    // scale the coordinates from 0 to 1 to a size within the column's width and height
    coordinates.x *= width;
    coordinates.y *= height;
    // // bound the coordinates based on height and width of the newly scaled coordinates
    // coordinates.x = Math.min(Math.max(coordinates.x, 0), width);
    // coordinates.y = Math.min(Math.max(coordinates.y, 0), height);
    return coordinates;
  };
};

export { objMap, landmarkToCoordinates };
