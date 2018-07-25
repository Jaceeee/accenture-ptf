// get personal coordinates
var currentLocation;

if("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
        currentLocation = position;
    })
} else {
    alert("geoloation is not available in your browser");
}

console.log("Triggered geolocation...")

// function for calling HERE api

function getLocationViaHERE(location) {
    var unres_coords = new Promise(function(resolve, reject) {
        $.ajax({
            url: 'https://geocoder.cit.api.here.com/6.2/geocode.json?app_id=jlSvwwwjsXosoDszZSTF&app_code=pAvc11w29ynkyotNn4vQ6A&searchtext=' + location
        }).then(function(data) {
              resolve(data.Response.View[0].Result[0].Location.DisplayPosition);
        });
    });

    return unres_coords
}

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamFjZXJvbGRhbiIsImEiOiJjamphMDh2bDIwMG91M3ZwZWVmbDM0OW1wIn0.RbYOzZO99zSWRcsD9GvwlQ', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(mymap);

//try using 'mapbox.streets' instead of 'mapbox.satellite' for maps street view

var marker = L.marker([51.5, -0.09]).addTo(mymap);


var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

var circle = L.circle([51.508, -0.11], 500, {
	color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
}).addTo(mymap);

// circle instantiation is now `L.circle([lat, lng], radius, options);`

// POPUPS

marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");


var popup = L.popup()
     .setLatLng([51.5, -0.09])
     .setContent("I am a standalone popup")
     .openOn(mymap);

function onMapClick(e) {
	popup.setLatLng(e.latlng)
	     .setContent("You clicked the map at " + e.latlng.toString())
	     .openOn(mymap);
}

mymap.on('click', onMapClick);
