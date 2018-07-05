var map;
//var osmUrl='http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png';
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © OpenStreetMap contributors';
var osmLayer = null;

var ajaxRequest = {};
//var plotlist;
var plotlayers=[];
var marker;


var homeIcon = L.icon({
  iconUrl: 'images/home.png',
  iconSize: [32, 32],
  iconAnchor: [16, 30],
  popupAnchor: [6, -29],
  shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});

var home_interestIcon = L.icon({
  iconUrl: 'images/home-interest.png',
  iconSize: [32, 32],
  iconAnchor: [16, 30],
  popupAnchor: [6, -29],
  shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});

var home_nointerestIcon = L.icon({
  iconUrl: 'images/home-nointerest.png',
  iconSize: [32, 32],
  iconAnchor: [16, 30],
  popupAnchor: [6, -29],
  //shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});

var home_interest_checkedIcon = L.icon({
  iconUrl: 'images/home-interest-checked.png',
  iconSize: [32, 32],
  iconAnchor: [16, 30],
  popupAnchor: [6, -29],
  shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});

var home_nointerest_checkedIcon = L.icon({
  iconUrl: 'images/home-nointerest-checked.png',
  iconSize: [32, 32],
  iconAnchor: [16, 30],
  popupAnchor: [6, -29],
  shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});


var home_interest_addrIcon = L.icon({
  iconUrl: 'images/home-interest-addr.png',
  iconSize: [45, 32],
  iconAnchor: [29, 30],
  popupAnchor: [6, -29],
  shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});

var home_nointerest_addrIcon = L.icon({
  iconUrl: 'images/home-nointerest-addr.png',
  iconSize: [45, 32],
  iconAnchor: [29, 30],
  popupAnchor: [6, -29],
  shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});

var home_interest_checked_addrIcon = L.icon({
  iconUrl: 'images/home-interest-checked-addr.png',
  iconSize: [45, 32],
  iconAnchor: [29, 30],
  popupAnchor: [6, -29],
  shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});

var home_nointerest_checked_addrIcon = L.icon({
  iconUrl: 'images/home-nointerest-checked-addr.png',
  iconSize: [45, 32],
  iconAnchor: [29, 30],
  popupAnchor: [6, -29],
  shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});

var home_moveIcon = L.icon({
  iconUrl: 'images/home-move.png',
  iconSize: [48, 48],
  iconAnchor: [16, 30],
  popupAnchor: [6, -29],
  shadowUrl: 'images/home_shad.png',
  shadowSize: [64, 37],
  shadowAnchor: [13, 36]
});

var iotbzhIcon = L.icon({
  iconUrl: 'images/iotbzh.png',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [-19, -38]
});

var iotbzhBlueIcon = L.icon({
  iconUrl: 'images/iotbzh_blue.png',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [-19, -38]
});


// object used to save the state of interactions with user
var userInteractions = {
  modifying : null,          // Id (in mySQL) of the currently modified plot (-1 means none)
  currentOpenedPopup : -1,    // Id of the plot for which a popup was last opened (-1 means none)
  reopenPopup : -1            // used by askForPlot() to save the previous. if != -1, askForPlotResponse() will reopen the given popup
};


function getHomeIcon(interest, checked, address) {
  if (interest) {
    if (checked) {
      if (address) {
        return home_interest_checked_addrIcon;
      } else {
        return home_interest_checkedIcon;
      }
    } else {
      if (address) {
        return home_interest_addrIcon;
      } else {
        return home_interestIcon;
      }
    }
  } else {
    if (checked) {
      if (address) {
        return home_nointerest_checked_addrIcon;
      } else {
        return home_nointerest_checkedIcon;
      }
    } else {
      if (address) {
        return home_nointerest_addrIcon;
      } else {
        return home_nointerestIcon;
      }
    }
  }
}



function initmap(id, lat, lng) {
  // set up the map
  map = new L.Map('map');
  
  // set up AJAX requests
  ajaxRequest.getPlots = getXmlHttpObject();
  if (ajaxRequest==null) {
    alert ("This browser does not support HTTP Request");
    return;
  }
  ajaxRequest.record=getXmlHttpObject();
  ajaxRequest.erase=getXmlHttpObject();
  ajaxRequest.mapState=getXmlHttpObject();  
  ajaxRequest.searchUrl=getXmlHttpObject();  
  

  // create the tile layer with correct attribution
  //var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  //var osmUrl='http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
  //var osmUrl='http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png';
  //var osmUrl='http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png';
  //var osmUrl='http://toolserver.org/~cmarqu/hill/{z}/{x}/{y}.png';
  //transport !!

  osmLayer = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 18, attribution: osmAttrib});    

  
  //map.setView(new L.LatLng(43.33,5.48),13);
  map.setView(new L.LatLng(0.0,0.0),1);  
  map.addLayer(osmLayer);
  
  // add the reference marker (TODO : read for database !)
  var iotbzhMarker = L.marker([47.755188, -3.363891], {icon: iotbzhIcon}).addTo(map);
  iotbzhMarker.bindPopup("<h3>IoT.bzh</h3> gare SNCF");
  var iotbzh2Marker = L.marker([47.748055, -3.357710], {icon: iotbzhBlueIcon}).addTo(map);
  iotbzh2Marker.bindPopup("<h3>IoT.bzh</h3> Halles St-Louis");

  // add the input marker and link its coordinates modifications (dragging) to submit form
  marker = L.marker([0,0]).addTo(map);
  marker.dragging.enable();
  marker.on('drag',onMarkerDrag);
  marker.on('dragend',onMarkerDrag);  
  marker.on('dblclick', hideMarker);
  // on map clicking, setup the marker at this position 
  map.on('click', onMapClick);  
  // set invisible
  marker.setOpacity(0);
  
  // NB : When modifying a plot, the marker is disabled.
  
  // on map moving, re-read plots, save state in DB
  map.on('moveend', onMapMove);  

  // read map state in database and restore
  if (!id) {
    restoreMapState(); // TODO : this call implies call to save map (as it modifies map state) 
  } else {
    map.setView([lat, lng], 13);
    userInteractions.reopenPopup = id;
  }
  
  // read plots from database (done in restoreMapState() 
  // askForPlots();  
}

var popup = L.popup();



function getXmlHttpObject() {
  if (window.XMLHttpRequest) { return new XMLHttpRequest(); }
  if (window.ActiveXObject)  { return new ActiveXObject("Microsoft.XMLHTTP"); }
  return null;
}




// ============== EVENTS CALLBACK PART ==========================================


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
    // when modifying, also update object in memory
    if (userInteractions.modifying) {
      userInteractions.modifying.lat = eLatlng.lat;
      userInteractions.modifying.lon = eLatlng.lng;
    }
  }
}

function hideMarker(e) {
  marker.setOpacity(0);
  document.getElementById("locLat").value = "";
  document.getElementById("locLng").value = "";
}


function onMapMove(e) {
  askForPlots(); 
  var loc = map.getCenter();
  recordMapState(loc.lng, loc.lat, map.getZoom());
}




function openMBdedBrowser(url) {
  document.getElementById("mbededXplorer").style.display = "block";
  document.getElementById("mBdedXpURLText").innerHTML = url;
  document.getElementById("mBdedXpPame").src = url;
  document.getElementById("map").style.height = "160px";
}

function closeMBdedBrowser() {
  document.getElementById("mbededXplorer").style.display = "none";
  document.getElementById("mBdedXpURLText").innerHTML = "";
  document.getElementById("mBdedXpPame").src = '';
  document.getElementById("map").style.height = "700px";
  askForPlots();
}




// === Search HTML callbacks ==
function showSearchBar() {
  document.getElementById("searchTable").style.display = "table";
  document.getElementById("showSearchBarButtunBox").style.visibility = "hidden";
  //document.getElementById("map").style.marginLeft = "auto";
}

function hideSearchBar() {
  document.getElementById("searchTable").style.display = "none";
  document.getElementById("showSearchBarButtunBox").style.visibility = "visible";
  //document.getElementById("map").style.marginLeft = "0px";  
}



function displayMapStyleMenu() {
  document.getElementById("mapStyleMenu").style.display = "block";
  document.getElementById("mapStyleMenuButtun").onclick = closeMapStyleMenu;
}

function closeMapStyleMenu() {
  document.getElementById("mapStyleMenu").style.display = "none";
  document.getElementById("mapStyleMenuButtun").onclick = displayMapStyleMenu;
}


function selectMapStyle(url) {
  osmUrl = url;
  map.removeLayer(osmLayer)
  osmLayer = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 18, attribution: osmAttrib});
  map.addLayer(osmLayer, true);
  document.getElementById("mapStyleMenu").style.display = "none";
  closeMapStyleMenu();
}


// ============== AJAX REQUESTS PART ==========================================


// ========= PLOTS AJAX REQUESTS==========

// === READ PLOTS===

// *** erase all plots
function removeMarkers() {
  for (i=0;i<plotlayers.length;i++) {
    map.removeLayer(plotlayers[i]);
  }
  plotlayers=[];
}


function popupHtml(data, plotIndex) {
  var html = "<h3>"+data.name+"</h3>";
  html += "<p>" + data.comment + "</p>";
  html += "<table class='popupButtonsTable'><tr>";
  var formatedUrl = data.url.replace(/ /g,"%20");
  if (data.url != "") {
    html += "<td class='popupButtonCell'><a title='Lien' onclick=openMBdedBrowser(\"";
    html += formatedUrl + "\");><img src='images/icon-link.png' height=22 width=22></a></td>";
  } else {
    html += "<td class='popupButtonCell'><img src='images/icon-nolink.png' height=22 width=22></td>";
  }
  html += "<td class='popupButtonCell'><a title='Modifier' onclick='modifyPlot(";
  html += plotIndex + ")'><img src='images/icon-modify.png' height=24 width=22></a></td>";
  html += "<td class='popupButtonCell'><a title='Effacer' onclick='erasePlot(" + plotIndex;
  html +=  ")'><img src='images/erase.png' height=22 width=22></a></td>";
  html += "</tr></table>";
  
  return html;
}


// *** Read plots informations in database (between map boundaries) and set them on map
function askForPlots() {
  if (!userInteractions.modifying && userInteractions.currentOpenedPopup != -1) {
    userInteractions.reopenPopup = userInteractions.currentOpenedPopup;
  }
  // request the marker info with AJAX for the current bounds
  var bounds=map.getBounds();
  var minll=bounds.getSouthWest();
  var maxll=bounds.getNorthEast();
  var msg='scripts/findbybbox.php?minlng='+minll.lng+'&minlat='+minll.lat+'&maxlng='+maxll.lng+'&maxlat='+maxll.lat;
  ajaxRequest.getPlots.onreadystatechange = askForPlotResponse;
  ajaxRequest.getPlots.open('GET', msg, true);
  ajaxRequest.getPlots.send(null);
}


function askForPlotResponse() {
  // if AJAX returned a list of markers, add them to the map
  if (ajaxRequest.getPlots.readyState==4) {
    //use the info here that was returned
    if (ajaxRequest.getPlots.status==200) {
      var plotlist=eval("(" + ajaxRequest.getPlots.responseText + ")");
      removeMarkers();
      for (i=0;i<plotlist.length;i++) {
        var plotll = new L.LatLng(plotlist[i].lat,plotlist[i].lon, true);
        var plotmark = new L.Marker(plotll);
        //plotmark.setIcon(homeIcon);
        plotmark.data = plotlist[i];
        /*if (plotmark.data.checked) {
          if (plotmark.data.interet) {
            plotmark.setIcon(home_interest_checkedIcon);
          } else {
            plotmark.setIcon(home_nointerest_checkedIcon);
          }
        } else {
          if (plotmark.data.interet) {
            plotmark.setIcon(home_interestIcon);
          } else {
            plotmark.setIcon(home_nointerestIcon);
          }
        }*/
        plotmark.setIcon(getHomeIcon(plotmark.data.interet, plotmark.data.checked, plotmark.data.address));
        if (!userInteractions.modifying) {
          map.addLayer(plotmark);
          // the user is not currently modifying a plot => all plots are same, and have popups
          var this_popup = plotmark.bindPopup(popupHtml(plotmark.data, i));
          // callback to save / reset the plot id when opening/closing the popups
          plotmark.on('popupopen', (function(j) {return function(e) {
            //alert("open : " + j);
            userInteractions.currentOpenedPopup = j;
          }}) (plotmark.data.id));             
          plotmark.on('popupclose', function(){/*alert("close : "+userInteractions.currentOpenedPopup);*/userInteractions.currentOpenedPopup=-1;});
          // if some popup was opened when askForPlot( was called, reopen it
          if (plotmark.data.id == userInteractions.reopenPopup) {
            // reopen the currently opened popup (especially when map dragged)
            this_popup.openPopup();
            userInteractions.reopenPopup = -1;
          }          
          plotlayers.push(plotmark);
        } else {
          // the user is modifying a plot, this one has a different icxon and is draggable. None has popup.
          if (plotmark.data.id == userInteractions.modifying.id) { 
            // NOTE : plotMark for modified plot is managed below            
            delete plotmark; // optionnal since JS is garbage collected,
          } else {
            map.addLayer(plotmark);
            plotlayers.push(plotmark);
          }
        }
        // save the plotmark       
      }
      
      // managing modified plotmark separatly (not from DB read, but directly form memory)
      if (userInteractions.modifying) {
        // replace plot using current form values 
        var plotmark = new L.Marker([userInteractions.modifying.lat, userInteractions.modifying.lon]);
        plotmark.data = userInteractions.modifying;
        // use the "draggable home" icon
        plotmark.setIcon(home_moveIcon);            
        map.addLayer(plotmark);
        plotmark.dragging.enable();
        // callbacks of marker dragging are reusable (exactly some code)
        plotmark.on('drag', onMarkerDrag);
        plotmark.on('dragend', onMarkerDrag);        
        plotlayers.push(plotmark);
      }
    }
  }
}




// === CREATE PLOT ===

// *** given the marker and form data, submit a new plot into DB
function submitLocation() {
  if ( (document.getElementById("locLat").value == "") 
    || (document.getElementById("locLat").value == "")) {
    alert("Merci de positionner le curseur avant de soumettre");
    } else {
      var params = "name=" + document.getElementById("name").value
                   + "&locLat=" + document.getElementById("locLat").value
                   + "&locLng=" + document.getElementById("locLng").value
                   + "&url=" + document.getElementById("url").value
                   + "&comment=" + document.getElementById("comment").value
                   + "&interet=" + (document.getElementById("interet").checked == true ? "1" : "0")
                   + "&checked=" + (document.getElementById("checked").checked == true ? "1" : "0")
                   + "&address=" + (document.getElementById("address").checked == true ? "1" : "0");
      //alert(document.getElementById("interet").checked + ", " + document.getElementById("checked").checked + "\n" + params);
      ajaxRequest.record.onreadystatechange = submitLocationResponse;
      ajaxRequest.record.open('POST', "scripts/recordLocation.php", true);
      ajaxRequest.record.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.record.setRequestHeader("Content-length", params.length);
      ajaxRequest.record.setRequestHeader("Connection", "close");
      ajaxRequest.record.send(params);
    }
}

function submitLocationResponse() {
  if (ajaxRequest.record.readyState==4) {
    //use the info here that was returned
    if (ajaxRequest.record.status==200) {
      var myMsg;
      if (ajaxRequest.record.responseText.trim() == "OK") {        
        hideMarker(null);
        document.getElementById("locLat").value = "";
        document.getElementById("locLng").value = "";
        document.getElementById("name").value = "";
        document.getElementById("url").value = "";
        document.getElementById("comment").value = "";
        document.getElementById("interet").checked = false;
        document.getElementById("checked").checked = false;
        document.getElementById("address").checked = false;
      } else {
        alert("Erreur à l'ajout de localisation : \n\""+ajaxRequest.record.responseText+"\"");
      }
      
      askForPlots();
    } else {
      // request response code wasn't 200
      alert("Problem sending AJAX request");
    }
  }   
}


// === DELETE PLOT ===

// given an id as argument, removes a plot from DB (called from popup buttons)
function erasePlot(i) {
  res = confirm("effacer cet emplacement ?");
  if (res) {
    var params="id="+plotlayers[i].data.id;
    ajaxRequest.erase.onreadystatechange = erasePlotResult;
    ajaxRequest.erase.open("POST", "scripts/removeplot.php", true);
    ajaxRequest.erase.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajaxRequest.erase.setRequestHeader("Content-length", params.length);
    ajaxRequest.erase.setRequestHeader("Connection", "close");
    ajaxRequest.erase.send(params);
  }
}


function erasePlotResult() {
  if (ajaxRequest.erase.readyState==4) {
    //use the info here that was returned
    if (ajaxRequest.erase.status == 200) {
      if (ajaxRequest.erase.responseText.trim() == "OK") {        
        // nothing to be done
      } else {
        alert("Erreur à la suppression : \n\""+ajaxRequest.erase.responseText+"\"");
      }
      askForPlots();    
    } else {
      // request response code wasn't 200
      alert("problem sending AJAX request");
    }
  }
}



// === MODIFY PLOT ===

function restoreFormSubmitMode() {   
  userInteractions.modifying = null; 
  // probably useless, but don't cost much...
  userInteractions.currentOpenedPopup = -1;
  userInteractions.reopenPopup = -1;
  
  
  // empty form
  document.getElementById("locLat").value = "";
  document.getElementById("locLng").value = "";
  document.getElementById("name").value = "";
  document.getElementById("url").value = "";
  document.getElementById("comment").value = "";
  document.getElementById("interet").checked = false;
  document.getElementById("checked").checked = false;
  document.getElementById("address").checked = false;
  
  document.getElementById("submitLocationButton").onclick = function(){submitLocation();};
  document.getElementById("submitLocationIcon").src = "images/icon-save.png";
  
  //restore marker behaviour
  marker.dragging.enable();
  marker.on('drag',onMarkerDrag);
  marker.on('dragend',onMarkerDrag);                    
  document.getElementById("markerIcon").src = "images/marker-icon.png";
  
  //remove cancelModifButton
  element = document.getElementById("cancelModifButton");
  element.parentNode.removeChild(element);
  
  //enable show search bar
  document.getElementById("toolBar").style.display = "block";
  document.getElementById("map").style.marginLeft = "0px";
  
  //restore plots state
  askForPlots();
}


// *** given an id, change the submit form to "modify" mode to allow modification of the given plot data (called from popup button)
// NOTE : plot will now be the last element in plotlayers (see askForPlot())
function modifyPlot(plotIndex) {  
  // add a "cancel modifications" button in the foprm
  var cancelButtonHtml ='<tr id="cancelModifButton"><td id="cancelModifButtonCell"><a id="cancelModifButton" title="cancel modifications" onclick="restoreFormSubmitMode();">'
  +'<img id="cancelModifIcon" src="images/icon-cancel.png" width="36" height="36" border="0"></a></td></tr>';
  //document.getElementById("buttonsTable").appendChild(cancelButtonHtml);
  document.getElementById("buttonsTable").innerHTML += cancelButtonHtml;
  
  // load plot data into form
  document.getElementById("locLat").value = plotlayers[plotIndex].data.lat;
  document.getElementById("locLng").value = plotlayers[plotIndex].data.lon;  
  document.getElementById("name").value = plotlayers[plotIndex].data.name;
  document.getElementById("url").value = plotlayers[plotIndex].data.url;
  document.getElementById("comment").value = plotlayers[plotIndex].data.comment.replace(/<br>/g,"\n");
  document.getElementById("interet").checked = (plotlayers[plotIndex].data.interet ? true : false);
  document.getElementById("checked").checked = (plotlayers[plotIndex].data.checked ? true : false);
  document.getElementById("address").checked = (plotlayers[plotIndex].data.address ? true : false);
  
  // modify submit button for "modification mode"
  document.getElementById("submitLocationButton").onclick = function(){updatePlot();};
  document.getElementById("submitLocationIcon").src = "images/icon-update.png";
  document.getElementById("markerIcon").src = "images/home-move.png";
  
  //hide search bar and disable show button
  hideSearchBar();
   document.getElementById("toolBar").style.display = "none";
   document.getElementById("map").style.marginLeft = "auto";
   
  
  // disable "classic" marker behaviour
  marker.dragging.disable();
  marker.setOpacity(0);
  // set the modified plot draggable
  // unbind popups for all plots
  // => done by askForPlots()
  
  /*plotlayers[plotIndex].setIcon(home_moveIcon);
  plotlayers[plotIndex].closePopup();
  plotlayers[plotIndex].dragging.enable();
  plotlayers[plotIndex].on('drag', onMarkerDrag);
  plotlayers[plotIndex].on('dragend', onMarkerDrag);
    
  for (j=0;j<plotlayers.length;j++) {
    plotlayers[j].unbindPopup();
  } 
  */
  userInteractions.modifying = plotlayers[plotIndex].data;  
  askForPlots();
}


// *** given a position and form data, updates plot data in DB (called form mofication mode form's submit button)
// NOTE : id of plot is in userInteractions.modifying.id
function updatePlot() {
  // assert we're in modification mode 
  if (!userInteractions.modifying) {
    alert("ERROR : updatePlot() call, while  not in modification mode !!");
    return;
  }
  
  if ( (document.getElementById("locLat").value == "") 
    || (document.getElementById("locLat").value == "")) {
      alert("Merci de positionner le curseur avant de soumettre");
    } else {
      var params = "id=" + userInteractions.modifying.id 
                 + "&name=" + document.getElementById("name").value
                 + "&locLat=" + document.getElementById("locLat").value
                 + "&locLng=" + document.getElementById("locLng").value
                 + "&url=" + document.getElementById("url").value
                 + "&comment=" + document.getElementById("comment").value
                 + "&interet=" + (document.getElementById("interet").checked == true ? "1" : "0")
                 + "&checked=" + (document.getElementById("checked").checked == true ? "1" : "0")
                 + "&address=" + (document.getElementById("address").checked == true ? "1" : "0");
                 
      //alert(document.getElementById("interet").checked + ", " + document.getElementById("checked").checked + "\n" + params);                 
      ajaxRequest.record.onreadystatechange = updatePlotResponse;
      ajaxRequest.record.open('POST', "scripts/updateLocation.php", true);
      ajaxRequest.record.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      ajaxRequest.record.setRequestHeader("Content-length", params.length);
      ajaxRequest.record.setRequestHeader("Connection", "close");
      ajaxRequest.record.send(params);
  }
}


function updatePlotResponse() {
  if (ajaxRequest.record.readyState==4) {
    //use the info here that was returned
    if (ajaxRequest.record.status==200) {
      if (ajaxRequest.record.responseText.trim() == "OK") {
        // restore submit form (and plots, as it calls askForPlots()
        restoreFormSubmitMode();
      } else {
        alert("Erreur à la mise à jour de la localisation : \n\""+ajaxRequest.record.responseText+"\"");
      }            
    } else {
      // request response code wasn't 200
      alert("Problem sending AJAX request");
    }
  }   
}






//  ========= URL SEARCH REQUEST==========

// *** Read plots informations in database (between map boundaries) and set them on map
function searchURL() {
  // request the marker info with AJAX for the current bounds
  var msg='scripts/searchUrl.php?url='+document.getElementById("searchInput").value;
  ajaxRequest.searchUrl.onreadystatechange = searchUrlResponse;
  ajaxRequest.searchUrl.open('GET', msg, true);
  ajaxRequest.searchUrl.send(null);
}

function searchUrlResponse() {
  if (ajaxRequest.searchUrl.readyState==4) {
    //use the info here that was returned
    if (ajaxRequest.searchUrl.status==200) {
      alert(ajaxRequest.searchUrl.responseText);
      var answerlist=eval("(" + ajaxRequest.searchUrl.responseText + ")");
      if (answerlist.length != 1) {
        alert("Problem : URL search has " + answerlist.length + " match(es)");
      } else {
        map.setView([answerlist[0].lat, answerlist[0].lon], map.getZoom());
        userInteractions.currentOpenedPopup = -1;
        userInteractions.reopenPopup = answerlist[0].id;
        askForPlot();
      }
    } else {
      // request response code wasn't 200
      alert("Problem sending AJAX request");
    }
  }     
}






// ========= MAP AJAX REQUESTS==========

// === READ REQUEST ===

// *** Read map state in DB and set it
function restoreMapState() {
  // request the marker info with AJAX for the current bounds
  ajaxRequest.mapState.onreadystatechange = restoreMapStateResponse;
  ajaxRequest.mapState.open('GET', "scripts/getMapState.php", true);
  ajaxRequest.mapState.send(null);
}

function restoreMapStateResponse() {
  if (ajaxRequest.mapState.readyState==4) {
    //use the info here that was returned
    if (ajaxRequest.mapState.status==200) {
      if (ajaxRequest.mapState.responseText.substr(0,2) == "OK") {
        var mapState = ajaxRequest.mapState.responseText.substr(5, ajaxRequest.mapState.responseText.length-1).split(',');
        if (mapState.length != 3) {
          alert("restoreMapState request did not respond 3 state variables (latitude, longitude, zoom)");        
        } else {
          map.setView([mapState[0], mapState[1]], mapState[2]);
        }
      } else {
        alert("Erreur à la lecture de l'état sauvegardé de la carte :\n" + ajaxRequest.mapState.responseText);
      }
      // no need to call ask for plots has map.setview() has a callback that calls it 
      //askForPlots();    
    } else {
      // request response code wasn't 200
      alert("problem sending AJAX request");
    }
  }
}




// === SAVE REQUEST ===

// *** save map sate in DB

function recordMapState(lng,lat,zoom) {  
  var params = "";
  var addEsp;
  if (lng != null) {
    params += "locLng=" + lng;
    addEsp = true;
  }
  if (lat != null) {
    if (addEsp == true) {
      params += "&";
    }
    params += "locLat=" + lat;
    addEsp = true;
  }
  if (zoom != null) {
    if (addEsp == true) {
      params += "&";
    }
    params += "zoom=" + zoom;
    addEsp = true;
  }
  
  ajaxRequest.mapState.onreadystatechange = recordMapStateResponse;
  ajaxRequest.mapState.open('POST', "scripts/recordMapState.php", true);
  ajaxRequest.mapState.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ajaxRequest.mapState.setRequestHeader("Content-length", params.length);
  ajaxRequest.mapState.setRequestHeader("Connection", "close");
  ajaxRequest.mapState.send(params);  
}


function recordMapStateResponse() {
  if (ajaxRequest.mapState.readyState==4) {
    //use the info here that was returned
    if (ajaxRequest.mapState.status==200) {
      var myMsg;
      if (ajaxRequest.mapState.responseText.trim() == "OK") {        
      } else {
        alert("Erreur à la sauvegarde de l'état de la map : \n\""+ajaxRequest.mapState.responseText+"\"");
      }
    } else {
      // request response code wasn't 200
      alert("Problem sending AJAX request");
    }
  }   
}



