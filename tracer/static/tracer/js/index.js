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
var routeColors = ['orange', 'blue', 'green', 'red', 'violet', 'yellow', 'chocolate', 'gray', 'maroon', 'deepskyblue'];

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

control = L.Routing.control({
    // arbitrary waypoints to set up latitude and longitude map screen
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
    var polyline = L.polyline(jeepneyRoutes[i].coordinates, {opacity: 0.0}).addTo(map);
    routes.push({name: jeepneyRoutes[i].name, polyline: polyline});
  }
  console.log(routes);
})
.addTo(map);

map.on('click', function(e) {
  var minDistance = 150;
  var marker = L.marker(e.latlng).addTo(map);
  marker.bindPopup(`lat: ${e.latlng.lat}, lng: ${e.latlng.lng}`);

  var suggestedRoutes = [];

  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    var closestPoint = route.polyline.closestLayerPoint(e.layerPoint);
    if (!closestPoint) continue; // not sure why sometimes closestPoint is null. As far as the testing, closestPoint only becomes null when the clicked point is far.
    var closestLatLng = map.layerPointToLatLng(closestPoint);
    var distance = closestLatLng.distanceTo(e.latlng);
    if (distance <= minDistance) {
      suggestRoute = {name: route.name, polyline: route.polyline, distance: distance, latLng: closestLatLng};
      suggestedRoutes.push(suggestRoute);
    }
  }

  if (suggestedRoutes.length) {
    $('#instructions').append(`<div id="route-selection">
                                <h5>Select a jeepney route</h5>
                                <select id="select-route" name="select-route">
                                </select>
                                <br><br>
                                <input id="route-submit" type="submit">
                              </div>`);

    for (var i = 0; i < suggestedRoutes.length; i++) {
      suggestedRoutes[i].polyline.setStyle({opacity: 1.0, color: routeColors[i]});
      marker = L.marker([suggestedRoutes[i].latLng.lat, suggestedRoutes[i].latLng.lng]).addTo(map);
      marker.bindPopup(`name: ${suggestedRoutes[i].name}, lat: ${suggestedRoutes[i].latLng.lat}, lng: ${suggestedRoutes[i].latLng.lng}`);
      console.log(`suggested: ${suggestedRoutes[i].name}`);
      $('#select-route').append(`<option value="${suggestedRoutes[i].name}">${suggestedRoutes[i].name}</option>`)
    }
    $('#route-submit').click(selectRoute);
    console.log("");
  } else {
    console.log("No jeepneys near that location");
  }
});

function selectRoute(e) {
  var selectedRoute = $('#select-route option:selected').val();
  $('#route-selection').remove();
  $('#instructions ol').append(`<li>${selectedRoute}</li>`);
}

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
