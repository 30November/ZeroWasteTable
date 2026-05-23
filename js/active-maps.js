// active-maps.js – initializes Leaflet map and shows active food listings (with clustering)

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('map')) return;

  // Default center: Bangalore (lat, lng)
  const defaultCenter = [12.9716, 77.5946];

  const map = L.map('map', { center: defaultCenter, zoom: 12, zoomControl: true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Simple locate control (centers map on user's location)
  const locateControl = L.control({ position: 'topright' });
  locateControl.onAdd = function () {
    const btn = L.DomUtil.create('button', 'leaflet-locate-btn');
    btn.type = 'button';
    btn.innerHTML = '📍';
    btn.title = 'Center to my location';
    btn.style.cssText = 'background:#111827;color:#fff;border:none;padding:6px 8px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.2);cursor:pointer';
    L.DomEvent.on(btn, 'click', function (e) {
      L.DomEvent.stopPropagation(e);
      map.locate({ setView: true, maxZoom: 15 });
    });
    return btn;
  };
  locateControl.addTo(map);

  let userLocationMarker = null;
  let userLocationCircle = null;
  map.on('locationfound', function (e) {
    if (userLocationMarker) {
      userLocationMarker.setLatLng(e.latlng);
      userLocationCircle.setLatLng(e.latlng).setRadius(e.accuracy);
    } else {
      userLocationMarker = L.marker(e.latlng, { icon: makeIcon('#FBBF24') }).addTo(map).bindPopup('You are here');
      userLocationCircle = L.circle(e.latlng, { radius: e.accuracy, color: '#FBBF24', fillColor: '#FBBF2433' }).addTo(map);
    }
  });
  map.on('locationerror', function (e) {
    console.warn('Location error:', e && e.message ? e.message : e);
  });

  let listings = [];
  let markers = []; // { marker: L.marker, type: string }
  const clusterGroup = L.markerClusterGroup();

  async function loadListings() {
    try {
      const response = await fetch('/data/active_listings.json');
      listings = await response.json();
    } catch (err) {
      console.error('Failed to load listings:', err);
      listings = [];
    }
  }

  function makeIcon(color) {
    return L.divIcon({
      className: '',
      html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.6);box-shadow:0 0 0 4px ${color}33,0 0 12px ${color}66;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10]
    });
  }

  function buildMarkers() {
    markers = listings.map(l => {
      // listings JSON stores coordinates as [lng, lat]
      const lat = l.coordinates[1];
      const lng = l.coordinates[0];
      const color = l.type === 'Cafe' ? '#10B981' : (l.type === 'Supermarket' ? '#3B82F6' : '#FF7E5F');
      const m = L.marker([lat, lng], { icon: makeIcon(color) });
      const popup = `<strong>${l.name}</strong><br/>${l.description}<br/>Type: ${l.type}`;
      m.bindPopup(popup);
      return { marker: m, type: l.type };
    });
  }

  function applyFilters() {
    const checkboxes = document.querySelectorAll('#filter-controls input[type=checkbox]');
    const activeTypes = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);

    clusterGroup.clearLayers();

    const visible = markers.filter(m => activeTypes.length === 0 ? true : activeTypes.includes(m.type));
    visible.forEach(mObj => clusterGroup.addLayer(mObj.marker));

    map.addLayer(clusterGroup);

    if (visible.length > 0) {
      const group = new L.featureGroup(visible.map(v => v.marker));
      map.fitBounds(group.getBounds().pad(0.2));
    }
  }

  function setupFilterListeners() {
    const checkboxes = document.querySelectorAll('#filter-controls input[type=checkbox]');
    checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  }

  (async function init() {
    await loadListings();
    buildMarkers();
    setupFilterListeners();
    applyFilters();
  })();
});
