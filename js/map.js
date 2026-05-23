// Leaflet-based registration map picker (replaces Mapbox usage)
let map;
let marker;

// Default location (Mumbai, India) as lat/lng object
const defaultLocation = { lat: 19.0760, lng: 72.8777 };

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('mapbox-actual-map')) {
    initRegistrationMap();
  }
});

function initRegistrationMap() {
  const container = document.getElementById('mapbox-actual-map');
  if (!container) return;

  try {
    map = L.map('mapbox-actual-map', {
      center: [defaultLocation.lat, defaultLocation.lng],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    function makeIcon(color) {
      return L.divIcon({
        className: '',
        html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 0 4px ${color}33,0 0 12px ${color}66;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -10]
      });
    }

    const greenIcon = makeIcon('#10B981');

    marker = L.marker([defaultLocation.lat, defaultLocation.lng], { draggable: true, icon: greenIcon }).addTo(map);

    // Update coordinate fields on load
    updateCoordinateInputs(defaultLocation.lng, defaultLocation.lat);

    // Handle marker drag completion
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      updateCoordinateInputs(pos.lng, pos.lat);
    });

    // Clicking on the map moves the marker
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      updateCoordinateInputs(e.latlng.lng, e.latlng.lat);
    });

    // Hide simulated overlay if Leaflet loaded correctly
    const overlay = document.getElementById('simulated-map-overlay');
    if (overlay) overlay.style.display = 'none';

  } catch (error) {
    console.warn('Leaflet failed to initialize registration map:', error);
  }
}

// Coordinate Sync Helper (expects lng, lat order like previous code)
function updateCoordinateInputs(lng, lat) {
  const lngInput = document.getElementById('reg-longitude');
  const latInput = document.getElementById('reg-latitude');

  if (lngInput && latInput) {
    lngInput.value = parseFloat(lng).toFixed(6);
    latInput.value = parseFloat(lat).toFixed(6);
  }
}

// Called from auth wizard to let Leaflet recompute layout
window.resizeMap = function() {
  if (map && typeof map.invalidateSize === 'function') {
    setTimeout(() => map.invalidateSize(), 150);
  }
};
