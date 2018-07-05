<!-- '
TODO : renames ids with prefix to avoid possible collisions
Also, give more consistent names !!
coucou
-->

<!DOCTYPE html>
<html>
  
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <link rel="stylesheet" type="text/css" href="leaflet/leaflet.css" />
    <link rel="stylesheet" type="text/css" href="styles/map.css" />
    <script type="text/javascript" src="leaflet/leaflet.js"></script>
    <script type="text/javascript" src="scripts/map.js"></script>
  </head>
  
  <?
    $id = $_GET['select'];
    $lat = $_GET['lat'];
    $lng = $_GET['lng'];
    if ($id != "") {  
      echo "<body onload='initmap($id, $lat, $lng)'>";  
    } else {
      echo "<body onload='initmap(0, 0, 0)'>";  
    }
  ?>
  <!--body onload="initmap()" -->    
    <!-- TOOL BAR -->
    <div id="toolBar">
      <div id="showSearchBarButtunBox" class="toolBarButtonDiv">
        <a id="showSearchBarButtun" class="toolBarButton" title="show search bar" onclick="showSearchBar()">
          <img id="showSearchBarIcon" class="toolBarIcon" width=40px height=40px src="images/search-button.png">
        </a>
      </div>
      <div id="linktoListButtunBox" class="toolBarButtonDiv">
        <a id="linktoListButtun" class="toolBarButton" title="show list of all spots" href="displayList.php">
          <img id="linktoListIcon" class="toolBarIcon" width=40px height=40px src="images/icon-list.png">
        </a>
      </div>
      <div id="mapStyleMenuButtonDiv" class="toolBarButtonDiv">
        <a id="mapStyleMenuButtun" class="toolBarButton" title="show list of all spots" onclick="displayMapStyleMenu()">
          <img id="mapStyleMenuIcon" class="toolBarIcon" width=40px height=40px src="images/icon-maps.png">
        </a>
        <!-- MAP STYLE MENU -->
        <div id="mapStyleMenu">
          <table id="mapStyleMenuTable">
            <?
            include("config.php");
            
            $db = mysql_connect($sqlhost,$dbuser,$dbpasswd) or die("Can't connect to SQL server (host = $sqlhost, user = $dbuser, pwd = $dbpasswd) : " . mysql_error());
            mysql_select_db($dbname, $db) or die( "Unable to select database $dbname");
            mysql_query("set names 'utf8'");

            $query = "SELECT name, url FROM mapstyles";

            
            $result = mysql_query($query);
            
            if ($result != null) {
              $alt = false;
              while($row = mysql_fetch_array($result)) {
                $name = $row[0]; 
                $url = $row[1];
                echo "            ";
                
                if ($alt) {
                  echo "<tr class='mapstyle_alt'><td class='mapstyle_alt'";
                } else {
                  echo "<tr class='mapstyle'><td class ='mapstyle'";
                }
                
                echo " onclick='selectMapStyle(\"$url\")'>$name</td></tr>\n";
                $alt ^= true;
              }
              echo "</table></div>";
            } 
            
            mysql_close($db);
            ?>
          </table>
        </div>
      </div>
    </div>
    
    
    <!-- SEARCH BAR -->
    <table id="searchTable"> 
      <tr>
        <td id="searchInputCell">
          <input id="searchInput" title="Chercher une URL existante sur la carte" type=text">
        </td>
        <td id="searchButtonCell">
          <a id=searchButton" title="search" onclick="searchURL()"><img id=searchButtonIcon" width=32 height=32 src="images/search-button.png"></a>
        </td>
        <td id="closeButtonCell">
          <a id=closeSearchBarButton" title="close search bar" onclick="hideSearchBar()"><img id=closeSearchBarIcon" width=32 height=32 src="images/icon-close.png"></a>
        </td>
      </tr>
    </table>
    
    <!-- MAP -->
    <div id="map"></div>

    
    <!-- SUBMIT FORM -->
    <table id="submitLocationDiv">
      <tr>
        <td id="markerIconDiv">
          <img id="markerIcon" src="images/marker-icon.png">
        </td>      
        <td id="submitLocationInputsDiv">
          <input id="locLat" type="text" name="locLat">
          <input id="locLng" type="text" name="locLng">
          <table>
            <tr>
              <td>Nom</td>
              <td><input id="name" type="text" name="name" title="Nom de l'emplacement" maxlength="48" size="48"></td>
            </tr>
            <tr>
              <td>URL</td>
              <td><input id="url" type="text" name="url" title="Adresse du lien (agence de location)" size="48"></td>
            </tr>
            <tr>
              <td colspan=2>
                <textarea id="comment" cols="59" rows="3" placeholder="Commentaires..."></textarea>
              </td>
            </tr>
            <tr><td colspan=2>
              <table id="checkboxTable">
                <tr>
                  <td>
                    <input type="checkbox" id="interet"> Interet
                  </td>
                  <td>
                    <input type="checkbox" id="checked"> Contact
                  </td>
                  <td>
                    <input type="checkbox" id="address"> Adresse
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td>
        <td>
          <table id="buttonsTable">
            <tr>
              <td id="submitLocationButtonDiv">
                <a id="submitLocationButton" title="submit" onclick="submitLocation();">
                  <img id="submitLocationIcon" src="images/icon-save.png" width="72" height="72" border="0">
                </a>        
              </td>
            </tr>
          </table>        
        </td>
      </tr>
    </table>
    
    
    <!-- EMBEDED EXPLORER -->
    <div id="mbededXplorer">
      <div id="mbededXplorerBar">
        <div id="mBdedXpCloseCross">
          <a title="close brose frame" onclick="closeMBdedBrowser();"><img id="mBdedXpCloseCrossImg" src="images/icon-close.png"></a>
        </div>
        <div id="mBdedXpURL">
          <span id="mBdedXpURLText">This is not an URL</span>
        </div>
      </div>
      <iframe id="mBdedXpPame" name="displayPane" src="">
      </iframe>
    </div>
    
  </body>
</html>

