var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var marker;

function initmap() {
  // set up the map
  map = new L.Map('map');
  // set up AJAX request
  ajaxRequest=getXmlHttpObject();
  if (ajaxRequest==null) {
    alert ("This browser does not support HTTP Request");
    return;
  }
  
  // create the tile layer with correct attribution
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © OpenStreetMap contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 18, attribution: osmAttrib});    

  // start the map in South-East England
  map.setView(new L.LatLng(48.11,-1.61),10);
  map.addLayer(osm);
  /*var popup = L.popup()
    .setLatLng([48.11,-1.61])
    .setContent("Coucou !!")
    .openOn(map);*/
  marker = L.marker([0,0]).addTo(map);
  //marker.bindPopup("<b>Coucou Aurore !</b><br>C'est fun, hein ?");
  //marker.draggable=true;
  marker.dragging.enable();
  marker.on('drag',onMarkerDrag);
  marker.on('dragend',onMarkerDrag)  
  marker.setOpacity(0);
  askForPlots();
    
  map.on('click', onMapClick);
  map.on('moveend', onMapMove);  
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
      //document.getElementById("debugField").innerHTML = e.latlng.toString(); 
    }
   
}

function onMarkerDrag(e) {
    if (document.getElementById)
    {
      var eLatlng = e.target.getLatLng(); 
      document.getElementById("locLat").value = eLatlng.lat.toFixed(6);
      document.getElementById("locLng").value = eLatlng.lng.toFixed(6);
      //document.getElementById("debugField").innerHTML = eLatlng.toString(); 
    }  
}


function getXmlHttpObject() {
  if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
  if (window.ActiveXObject)  { return new ActiveXObject("Microsoft.XMLHTTP"); }
  return null;
}

function askForPlots() {
  // request the marker info with AJAX for the current bounds
  var bounds=map.getBounds();
  var minll=bounds.getSouthWest();
  var maxll=bounds.getNorthEast();
  var msg='leaflet/findbybbox.cgi?format=leaflet&bbox='+minll.lng+','+minll.lat+','+maxll.lng+','+maxll.lat;
  ajaxRequest.onreadystatechange = stateChanged;
  ajaxRequest.open('GET', msg, true);
  ajaxRequest.send(null);
}

var homeIcon = L.icon({
  iconUrl: 'icons/home.png',
  iconSize: [32, 32],
  iconAnchor: [16, 30],
  popupAnchor: [22, 0],
  shadowUrl: 'icons/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [14, 35]
});

function stateChanged() {
  // if AJAX returned a list of markers, add them to the map
  if (ajaxRequest.readyState==4) {
    //use the info here that was returned
    if (ajaxRequest.status==200) {
      plotlist=eval("(" + ajaxRequest.responseText + ")");
      removeMarkers();
      for (i=0;i<plotlist.length;i++) {
        var plotll = new L.LatLng(plotlist[i].lat,plotlist[i].lon, true);
        var plotmark = new L.Marker(plotll, {icon: myIcon});
        plotmark.data=plotlist[i];
        map.addLayer(plotmark);
        plotmark.bindPopup("<h3>"+plotlist[i].name+"</h3><a href="+plotlist[i].url+">lien web</a>");
        plotlayers.push(plotmark);
      }
    }
  }
}

function removeMarkers() {
  for (i=0;i<plotlayers.length;i++) {
    map.removeLayer(plotlayers[i]);
  }
  plotlayers=[];
}


// then add this as a new function...
function onMapMove(e) { askForPlots(); }


