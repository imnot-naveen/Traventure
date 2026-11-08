/**
 * Traventure Interactive Transit Map Controller (Leaflet.js)
 */

let activeMap = null;
let activeRouteLayerGroup = null;

/**
 * Initializes the Leaflet map instance with dark CartoDB tiles.
 */
function initTransitMap(containerId = "transit-map-container") {
  const container = document.getElementById(containerId);
  if (!container) return null;

  if (activeMap) {
    activeMap.remove();
  }

  // Centered on Sri Lanka [lat: 7.8731, lng: 80.7718]
  activeMap = L.map(containerId, {
    zoomControl: false,
    attributionControl: false
  }).setView([7.8731, 80.7718], 7.5);

  // CartoDB Dark Matter vector tiles
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 18,
    subdomains: "abcd"
  }).addTo(activeMap);

  // Custom Zoom Control at top-right
  L.control.zoom({ position: "topright" }).addTo(activeMap);

  activeRouteLayerGroup = L.layerGroup().addTo(activeMap);
  return activeMap;
}

/**
 * Renders a complete train route on the Leaflet map:
 * - Clears prior route layers
 * - Draws cyan polyline through waypoints
 * - Places styled circle markers for origin, destination, and intermediate stops
 * - Fits map view to route bounds
 *
 * @param {L.Map} map
 * @param {Object} routeData
 */
function renderTrainRouteOnMap(map, routeData) {
  if (activeRouteLayerGroup) {
    activeRouteLayerGroup.clearLayers();
  }

  if (!routeData || !routeData.waypoints || routeData.waypoints.length === 0) {
    return;
  }

  // Ensure map container dimensions are updated inside modal
  map.invalidateSize();

  const polyline = L.polyline(routeData.waypoints, {
    color: "#00d9ff",
    weight: 4,
    opacity: 0.9,
    lineJoin: "round"
  }).addTo(activeRouteLayerGroup);

  const stops = routeData.stops || [];
  const totalStops = stops.length;

  stops.forEach((stop, index) => {
    if (!stop.lat || !stop.lng) {
      return;
    }

    const isOrigin = index === 0;
    const isDest = index === totalStops - 1;

    let markerColor = "#94a3b8";
    if (isOrigin) {
      markerColor = "#00d9ff";
    } else if (isDest) {
      markerColor = "#f43f5e";
    }

    const marker = L.circleMarker([stop.lat, stop.lng], {
      radius: isOrigin || isDest ? 7 : 4,
      fillColor: markerColor,
      color: "#ffffff",
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.9
    }).addTo(activeRouteLayerGroup);

    marker.bindTooltip(
      `<strong>${stop.stationName}</strong><br><span style="font-size:11px;color:#94a3b8">Arr: ${stop.arrivalTime} | Dep: ${stop.departureTime}</span>`,
      { direction: "top", offset: [0, -5] }
    );
  });

  map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
}


// Global exposure for UI integration
window.initTransitMap = initTransitMap;
window.renderTrainRouteOnMap = renderTrainRouteOnMap;

