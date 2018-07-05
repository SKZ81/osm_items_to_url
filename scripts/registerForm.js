var map;
var marker;

function initmap() {
	// set up the map
	map = new L.Map('map');
  // set up AJAX request
  
	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © OpenStreetMap contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 18, attribution: osmAttrib});		

	// start the map in South-East England
	map.setView(new L.LatLng(48.11,-1.61),10);
	map.addLayer(osm);
  marker = L.marker([0,0]).addTo(map);
  marker.dragging.enable();
  marker.on('drag',onMarkerDrag);
  marker.on('dragend',onMarkerDrag)  
  marker.setOpacity(0);
    
  map.on('click', onMapClick);
//	map.on('moveend', onMapMove);  
}

var popup = L.popup();

function onMapClick(e) {
    marker.setLatLng(e.latlng);
    marker.update();
    marker.setOpacity(100);
    if (document.getElementById)
    {
      document.getElementById("locLat").value = e.latlng.lat.toFixed(6);
      document.getElementById("locLng").value = e.latlng.lng.toFixed(6);
    }
   
}

function onMarkerDrag(e) {
    if (document.getElementById)
    {
      var eLatlng = e.target.getLatLng(); 
      document.getElementById("locLat").value = eLatlng.lat.toFixed(6);
      document.getElementById("locLng").value = eLatlng.lng.toFixed(6);
    }  
}

