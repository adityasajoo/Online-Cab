// const map = L.map('map', {
//     center: [ 12.972442, 77.580643],
//     zoom: 13
//   });

(function(){
    //MAKE AUTO COMPLETE INPUT
    var placesAutocomplete = places({
        appId: 'pl169BAZHP7P',
        apiKey: '86ebf08c36d9d651b8418ef7e9bf8fad',
        container: document.querySelector('#pickup')
    });
    var placesAutocomplete1 = places({
        appId: 'pl169BAZHP7P',
        apiKey: '86ebf08c36d9d651b8418ef7e9bf8fad',
        container: document.querySelector('#drop')
    });



var mymap = L.map('mapid').setView([12.972442, 77.580643], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);


var markers = [];

mymap.addLayer(osmLayer);


placesAutocomplete.on('suggestions', handleOnSuggestions);
placesAutocomplete.on('cursorchanged', handleOnCursorchanged);
  placesAutocomplete.on('change', handleOnChange);
  placesAutocomplete.on('clear', handleOnClear);

  function handleOnSuggestions(e) {
    markers.forEach(removeMarker);
    markers = [];

    if (e.suggestions.length === 0) {
      mymap.setView(new L.LatLng(0, 0), 1);
      return;
    }

    e.suggestions.forEach(addMarker);
    findBestZoom();
  }

  function handleOnChange(e) {
    markers
      .forEach(function(marker, markerIndex) {
        if (markerIndex === e.suggestionIndex) {
          markers = [marker];
          marker.setOpacity(1);
          findBestZoom();
        } else {
          removeMarker(marker);
        }
      });
  }

  function handleOnClear() {
    mymap.setView(new L.LatLng(0, 0), 1);
    markers.forEach(removeMarker);
  }

  function handleOnCursorchanged(e) {
    markers
      .forEach(function(marker, markerIndex) {
        if (markerIndex === e.suggestionIndex) {
          marker.setOpacity(1);
          marker.setZIndexOffset(1000);
        } else {
          marker.setZIndexOffset(0);
          marker.setOpacity(0.5);
        }
      });
  }

  function addMarker(suggestion) {
    var marker = L.marker(suggestion.latlng, {opacity: .4});
    marker.addTo(mymap);
    markers.push(marker);
  }

  function removeMarker(marker) {
    mymap.removeLayer(marker);
  }

  function findBestZoom() {
    var featureGroup = L.featureGroup(markers);
    mymap.fitBounds(featureGroup.getBounds().pad(0.5), {animate: false});
  }

})()