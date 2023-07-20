//Create the Leaflet map instance
let map = L.map('map').setView([0, 0], 2);

// Add the tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map);

// Function to create earthquake markers and add them to the map
function createFeatures(earthquakeData) {
  // Define a function to calculate the marker size based on magnitude
  function getMarkerSize(magnitude) {
    return magnitude * 4; // Adjust the multiplier as needed
  }

  // Define a function to calculate the marker color based on depth
  function MarkerColor(depth) {
    if (depth < 10) {
      return '#7FFF00'; // Green
    } else if (depth < 30) {
      return '#FFFF00'; // Yellow
    } else if (depth < 50) {
      return '#FFA500'; // Orange
    } else {
      return '#FF0000'; // Red
    }
  }

  // Loop through the earthquake data
  earthquakeData.forEach(function (earthquake) {
    // Extract the necessary information from the earthquake object
    let magnitude = earthquake.properties.mag;
    let place = earthquake.properties.place;
    let time = new Date(earthquake.properties.time).toLocaleString();
    let depth = earthquake.geometry.coordinates[2];
    let coordinates = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];

    // Create a marker with a popup containing the magnitude, place, time, and depth information
    let marker = L.circleMarker(coordinates, {
      radius: getMarkerSize(magnitude),
      fillColor: MarkerColor(depth),
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).bindPopup(
      `<strong>Magnitude: ${magnitude}</strong><br>` +
      `Place: ${place}<br>` +
      `Time: ${time}<br>` +
      `Depth: ${depth} km`
    ).addTo(map);
  });

  // Create a legend
  let legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'legend');
    let depths = [-10, 10, 30, 50, 70, 90];
    let labels = [];
    let colors = ['#7FFF00', '#FFFF00', '#FFA500', '#FF4500', '#FF0000'];

    // Loop through the depth categories and generate the legend labels
    for (let i = 0; i < depths.length; i++) {
      labels.push(
        `<i style="background:${MarkerColor(depths[i] + 1)}"></i> ${depths[i]}-${depths[i + 1]} km`
      );
    }

    div.innerHTML = labels.join('<br>');
    return div;
  };
  legend.addTo(map);
}

// Define the queryUrl variable
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function(data) {
  console.log(data.features);
  createFeatures(data.features);
});