const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

export const DistanceCalculator = (
  {lat: lat1, lng: lon1}: google.maps.LatLngLiteral,
  {lat: lat2, lng: lon2}: google.maps.LatLngLiteral
) => {
  const earthRadiusMiles = 3959 // Радиус Земли в милях

  const dLat = degreesToRadians(lat2 - lat1)
  const dLon = degreesToRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = earthRadiusMiles * c

  return distance
}
