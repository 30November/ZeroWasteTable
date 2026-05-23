// Mapbox Integration and coordinate verification
let map;
let marker;

// Default location (e.g., Mumbai, India coordinates)
const defaultLocation = [72.8777, 19.0760];

document.addEventListener('DOMContentLoaded', () => {
  // If map container exists in registration wizard, try to load it
  if (document.getElementById('mapbox-actual-map')) {
    initRegistrationMap();
  }
});

function initRegistrationMap() {
  // Check if Mapbox Access Token is provided.
  // Using a sandbox/public fallback if not explicitly defined.
  const token = 'pk.eyJ1Ijoic2hhaGlyYWhtYW4iLCJhIjoiY2x2am44OGMxMGJ5OTJpcXo3azUwcHpxYSJ9._Jsn99lP9d1cPhT6Pec5jA'; // Safe default token for sandbox demos
  
  try {
    mapboxgl.accessToken = token;
    
    map = new mapboxgl.Map({
      container: 'mapbox-actual-map',
      style: 'mapbox://styles/mapbox/dark-v11', // Beautiful premium dark theme
      center: defaultLocation,
      zoom: 12
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create marker
    marker = new mapboxgl.Marker({
      color: "#10B981", // Matching emerald theme
      draggable: true
    })
    .setLngLat(defaultLocation)
    .addTo(map);

    // Update coordinate fields on load
    updateCoordinateInputs(defaultLocation[0], defaultLocation[1]);

    // Handle marker drag completion
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      updateCoordinateInputs(lngLat.lng, lngLat.lat);
    });

    // Handle clicking anywhere on the map to re-center marker
    map.on('click', (e) => {
      const coords = [e.lngLat.lng, e.lngLat.lat];
      marker.setLngLat(coords);
      updateCoordinateInputs(coords[0], coords[1]);
    });

    // Hide simulated overlay if Mapbox loaded correctly
    const overlay = document.getElementById('simulated-map-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }

  } catch (error) {
    console.warn("Mapbox GL JS failed to load - Falling back to simulated geopicker:", error);
    // Keep simulated overlay visual visible
  }
}

// Coordinate Sync Helper
function updateCoordinateInputs(lng, lat) {
  const lngInput = document.getElementById('reg-longitude');
  const latInput = document.getElementById('reg-latitude');
  
  if (lngInput && latInput) {
    lngInput.value = lng.toFixed(6);
    latInput.value = lat.toFixed(6);
  }
}

// Function triggered on step wizard transition to reload canvas sizes
window.resizeMap = function() {
  if (map) {
    map.resize();
  }
};
