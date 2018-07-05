<?
  include("../config.php");
  
  $query = "SELECT lat, lng, zoom FROM config_map WHERE id=\"" . $mapConfigId . "\"";
  
  //echo $lat . ', ' . $lng . ", " . $zoom;
  
  $db = mysql_connect($sqlhost,$dbuser,$dbpasswd) or die("Can't connect to SQL server" . $sqlhost);   
  mysql_select_db($db) or die( "Unable to select database " . $db);
  mysql_query("set names 'utf8'");
  
  $result = mysql_query($query);
  $nbRows = mysql_num_rows($result);
  if ($nbRows == 1) {
    $row = mysql_fetch_array($result);
    echo "OK : " . $row[0] . "," . $row[1] . "," . $row[2];
  } else {
    echo "SQL ERROR while reading map state, (SQL : ". $query .")";
    if ($nbRows == 0) {
      echo "Cause : No entry found";
    } else {
      echo "Cause : Multiple entry found";
    }
  }
  
  mysql_close($db);  
?>