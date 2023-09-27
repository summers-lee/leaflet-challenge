//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

var myMap = L.map("map").setView([44.427963, -110.5884], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

function markerSize(magnitude) {
  return magnitude;
}

var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

function onEachFeature(feature, layer) {
  var earthquakeTime = new Date(feature.properties.time).toLocaleString();
  layer.bindPopup(
    `<h2>Earthquake Location: ${feature.properties.place}</h2> <hr> <h3>Magnitude: ${feature.properties.mag}</h3> <hr> <h3>Depth: ${feature.geometry.coordinates[2]} km</h3> <hr> <h3>Date/Time: ${earthquakeTime}</h3>`
  );
}

function pointToLayer(feature, coordinates) {
  return L.circleMarker(coordinates, stylish(feature));
}

function depthColor(depthValue) {
  if (depthValue >= 90) {
    return "#870805";
  } else if (depthValue >= 70) {
    return "#a8432f";
  } else if (depthValue >= 50) {
    return "#de9f18";
  } else if (depthValue >= 30) {
    return "#d9de40";
  } else if (depthValue >= 10) {
    return "#a1de6f";
  } else {
    return "#66d909";
  }
}

function stylish(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    color: "black",
    weight: 0.3,
    fillColor: depthColor(feature.geometry.coordinates[2]),
    radius: markerSize(feature.properties.mag),
  };
}

function createLegend() {
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Depth</h4>";
    div.innerHTML += '<i style="background: #870805"></i><span>90+ km</span><br>';
    div.innerHTML += '<i style="background: #a8432f"></i><span>70-90 km</span><br>';
    div.innerHTML += '<i style="background: #de9f18"></i><span>50-70 km</span><br>';
    div.innerHTML += '<i style="background: #d9de40"></i><span>30-50 km</span><br>';
    div.innerHTML += '<i style="background: #a1de6f"></i><span>10-30 km</span><br>';
    div.innerHTML += '<i style="background: #66d909"></i><span><10 km</span><br>';

    return div;
  };

  legend.addTo(myMap);
}

d3.json(geoData).then(function (data) {
  L.geoJson(data, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature,
  }).addTo(myMap);

  createLegend();
});