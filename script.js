// elements
let latitudeText = document.querySelector('.latitude');
let longitudeText = document.querySelector('.longitude');
let timeText = document.querySelector('.time');
let speedText = document.querySelector('.speed');
let altitudeText = document.querySelector('.altitude');
let visibilityText = document.querySelector('.visibility');

/* default latitude and longitude. Here lat and long is for "MALAYSIA" */
let lat = 4.2105;
let long = 101.9758;
let zoomLevel = 8;

// iss.png image as Marker
const icon = L.icon({
  iconUrl: './img/iss.png',
  iconSize: [90, 45],
  iconAnchor: [25, 94],
  popupAnchor: [20, -86]
});

// drawing map interface on #map-div
const map = L.map('map-div').setView([lat, long], zoomLevel);

// add map tiles from Mapbox's Static Tiles API
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiZmF0eW4iLCJhIjoiY2t3b3p6NnM4MDd5MzJ1cWtuNzFjdzY1biJ9.e6jgE2sMrX3LyAFf5UCLgw'
}).addTo(map);

// adding the Marker to map
const marker = L.marker([lat, long], { icon: icon }).addTo(map);

// findISS() function definition
function findISS() {
  fetch("https://api.wheretheiss.at/v1/satellites/25544")
  .then(response => response.json())
  .then(data => {
    lat = data.latitude.toFixed(2);
    long = data.longitude.toFixed(2);
    // convert seconds to milliseconds, then UTC format
    const timestamp = new Date(data.timestamp * 1000).toUTCString();
    const speed = data.velocity.toFixed(2);
    const altitude = data.altitude.toFixed(2);
    const visibility = data.visibility;

    // call updateISS() function to update things
    updateISS(lat, long, timestamp, speed, altitude, visibility);
  })
  .catch(e => console.log(e));
}

// updateISS() function definition
function updateISS(lat, long, timestamp, speed, altitude, visibility) {
  // updates Marker's lat and long on map
  marker.setLatLng([lat, long]);
  // updates map view according to Marker's new position
  map.setView([lat, long]);
  // updates other element's value
  latitudeText.innerText = lat;
  longitudeText.innerText = long;
  timeText.innerText = timestamp;
  speedText.innerText = `${speed} km/hr`;
  altitudeText.innerText = `${altitude} km`;
  visibilityText.innerText = visibility;
}

/* call findISS() to set ISS location */
findISS();

// call findISS() for every 2 seconds
setInterval(findISS, 2000);
