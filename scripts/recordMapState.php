<?
  include("../config.php");
  
  $lat = $_POST["locLat"];
  $lng = $_POST["locLng"];
  $zoom = $_POST["zoom"];
  
  $query = "UPDATE config_map SET ";
  if($lat != "") {
    $query .= "lat=" . $lat;
    $addComa=true;
  }
  if($lng != "") {
    if (addComa) {
      $query .= ",";
    }
    $query .= "lng=" . $lng;
    $addComa=true;
  }
  if($zoom != "") {
    if (addComa) {
      $query .= ",";
    }
    $query .= "zoom=" . $zoom;
    $addComa=true;
  }
  $query .= " WHERE id=\"" . $mapConfigId . "\"";
  
  //echo $lat . ', ' . $lng . ", " . $zoom;
  
  $db = mysql_connect($sqlhost,$dbuser,$dbpasswd) or die("Can't connect to SQL server" . $sqlhost);   
  mysql_select_db($db) or die( "Unable to select database " . $db);
  mysql_query("set names 'utf8'");
  
  $result = mysql_query($query);
  
  if ($result == true) {
    echo "OK";
  } else {
    echo "SQL ERROR while recording map state, (SQL : ". $query .")";
  }
  
  mysql_close($db);  
?>