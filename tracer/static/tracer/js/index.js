$(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });
});

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
 }

var map = L.map('map');
var routes = [];
var saveRouteMode = false;

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

control = L.Routing.control({
    // arbitrary waypoints to set up latitud and longitude map screen
    waypoints: [
      L.latLng(10.319473, 123.903519),
      L.latLng(10.318842, 123.902977),
      L.latLng(10.320427, 123.899217),
      L.latLng(10.330340, 123.899744),
      L.latLng(10.326041, 123.907387),
      L.latLng(10.319473, 123.903519),
    ],
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim(),
    router: L.Routing.mapbox('pk.eyJ1IjoiamFjZXJvbGRhbiIsImEiOiJjamp6dDM0OTgwZmJ6M3B0eTZyNmhkaWZ6In0.jdkab4YMJJKdrI5rz_bzLg')
})
.on('routeselected', function(e) {
  var route = e.route;
  map.removeControl(control);

  if (saveRouteMode) {
    saveRoute("04M", route);
    return;
  }

  for (var i = 0; i < jeepneyRoutes.length; i++) {
    var polyline = L.polyline(jeepneyRoutes[i].coordinates, {color: 'blue'}).addTo(map);
    routes.push(polyline);
  }
})
.addTo(map);

map.on('click', function(e) {
  var marker = L.marker(e.latlng).addTo(map);
  marker.bindPopup(`lat: ${e.latlng.lat}, lng: ${e.latlng.lng}`);

  var bestRoute = {code: "", distance: 9999};
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    // get distance of route from point
    // if distance less than best route distance, save route as best route
  }

  // display best route

  var closestPoint = routes[0].closestLayerPoint(e.layerPoint);
  var closestLatLng = map.layerPointToLatLng(closestPoint);

  marker = L.marker([closestLatLng.lat, closestLatLng.lng]).addTo(map);
  marker.bindPopup(`lat: ${closestLatLng.lat}, lng: ${closestLatLng.lng}`);
});

// utility function to save route to database
function saveRoute(name, route) {
  var coordinates = '';
  for (var i = 0; i < route.coordinates.length; i++) {
    coordinates += `[${route.coordinates[i].lat}, ${route.coordinates[i].lng}],\n`;
  }

  $.ajax({
    type: "POST",
    url: 'save_route/',
    data: {
      'name': name,
      'coordinates': coordinates,
    },
    dataType: 'json',
    success: function (data) {
      if (data.created) {
        console.log("route created");
      }
    }
  });
}
