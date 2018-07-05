<?   // AJAX Script
  // database parameters 
  include("../config.php");
  
  /* AJAX parameters : minlng,minlat,maxlat,maxlng*/
  $minlat=$_GET["url"];
  
  /* AJAX RESPONSE FORMAT in JSON
  [{"name":"Tunbridge Wells, Langton Road, Burnt Cottage",
    "lon":"0.213102",
    "lat":"51.1429",
    "details":"A Grade II listed five bedroom wing in need of renovation."}*/
  
   
  $db = mysql_connect($sqlhost,$dbuser,$dbpasswd) or die("Can't connect to SQL server");   
  mysql_select_db($db) or die( "Unable to select database");
  mysql_query("set names 'utf8'");

  $query = "SELECT id, name, locLng, locLat, url, comment FROM " . $appartsTable . " WHERE url = \"" . $url . "\"";
  //SELECT firstname, lastname, locLat, locLng, (SELECT kindlabel FROM userkind WHERE id=user.kind) FROM users WHERE locLat BETWEEN -90 AND 90 AND locLng BETWEEN -180 AND 180
  //echo $query . "<br>";
  
  $result = mysql_query($query);
  
  if ($result != null) {
    $response = "[";   
    $firstElement = true; 
    while($row = mysql_fetch_array($result)) {
      if(!$firstElement) {$response .= ",";} else {$firstElement = false;}
      $response .= '{"id":"' . $row[0] . /* id */
                   '", "name":"' . $row[1] . /* name */
                   '", "lon":"' . $row[2] . /*locLng*/ 
                   '", "lat":"' . $row[3] . /* locLat */
                   '","url":"' . $row[4] . /* url, plaintext */
                   '","comment":"' . $row[5] . /* comment */
                   '"}';
    }
    $response .= "]";
  }
  //echo $query;
  


  echo $response;
  
  mysql_close($db);
?>
