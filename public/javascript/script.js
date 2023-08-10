const SEARCH = document.getElementById('search');
const SEARCH_BUTTON = document.getElementById('search__button');
const SEARCH_INPUT = document.getElementById('search__input');
const IP = document.getElementById('IP');
const LOCATION = document.getElementById('Location');
const TIMEZONE = document.getElementById('Timezone');
const ISP = document.getElementById('ISP');

let queryValue = undefined;
let apiKey = 'at_Kn7KUal2DUcjgcHbyS3sBBOHo1RYA';
let link = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${queryValue}`;

let lat = 51.5;
let lng = -0.09;
// create a map
let map = L.map('map', { zoomControl: false }).setView([lat, lng], 13);
// add a tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
}).addTo(map);
// custom marker
const customIcon = L.icon({
  iconUrl: 'assets/icon-location.svg',
  // icon width=46 and height=56
  iconSize: [46, 56],
  // divide height in half
  iconAnchor: [23, 56],
});
// create marker
let marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
displayData(link);

// remove error class when input is back on focus
SEARCH_INPUT.addEventListener('click', () => {
  SEARCH.classList.remove('search--error');
});
SEARCH_BUTTON.addEventListener('click', (e) => {
  e.preventDefault();
  // validate user input before wasting a fetch request
  if (isValidDomain(SEARCH_INPUT.value) || isValidIP(SEARCH_INPUT.value)) {
    link = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&${queryValue}`;
    displayData(link);
  } else {
    console.log('invalid input');
    SEARCH.classList.add('search--error');
  }
});

async function displayData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    IP.innerHTML = data.ip;
    LOCATION.innerHTML = `${data.location.city}, ${data.location.region}, ${data.location.country}`;
    TIMEZONE.innerHTML = `UTC${data.location.timezone}`;
    ISP.innerHTML = data.isp;
    lat = data.location.lat;
    lng = data.location.lng;
    // move marker to new location
    marker.setLatLng({ lat: data.location.lat, lng: data.location.lng });
    // move center of view to the new location
    map.panTo([data.location.lat, data.location.lng]);
  } catch (error) {
    console.error(error);
  }
}

function isValidDomain(str) {
  // Regex to check valid
  // Domain Name
  let regex = new RegExp(/^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/);

  // if str
  // is empty return false
  if (str == null) {
    return false;
  }

  // Return true if the str
  // matched the ReGex
  if (regex.test(str) == true) {
    queryValue = `domain=${str}`;
    return true;
  } else {
    return false;
  }
}
function isValidIP(IP) {
  // Regex expression for validating IPv4
  let ipv4 = /(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])/;

  // Regex expression for validating IPv6
  let ipv6 = /((([0-9a-fA-F]){1,4})\:){7}([0-9a-fA-F]){1,4}/;

  // Checking if it is a valid IPv4 addresses
  if (IP.match(ipv4)) {
    queryValue = `ipAddress=${IP}`;
    return true;
  }
  // Checking if it is a valid IPv6 addresses
  else if (IP.match(ipv6)) {
    queryValue = `ipAddress=${IP}`;
    return true;
  }
  // Return Invalid
  return false;
}
