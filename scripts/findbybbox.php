<?   // AJAX Script
  // database parameters 
  include("../config.php");
  
  /* AJAX parameters : minlng,minlat,maxlat,maxlng*/
  $minlat=$_GET["minlat"];
  $minlng=$_GET["minlng"];
  $maxlat=$_GET["maxlat"];
  $maxlng=$_GET["maxlng"];
  
  /* AJAX RESPONSE FORMAT in JSON
  [{"name":"Tunbridge Wells, Langton Road, Burnt Cottage",
    "lon":"0.213102",
    "lat":"51.1429",
    "details":"A Grade II listed five bedroom wing in need of renovation."}*/
  
   
  $db = mysql_connect($sqlhost,$dbuser,$dbpasswd) or die("Can't connect to SQL server");   
  mysql_select_db($db) or die( "Unable to select database");
  mysql_query("set names 'utf8'");

  $query = "SELECT id, name, locLng, locLat, url, comment, interet, checked, address FROM $appartsTable WHERE locLat BETWEEN $minlat AND $maxlat AND locLng BETWEEN $minlng AND $maxlng";
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
                   '","interet":' . $row[6] . /* interet */
                   ',"checked":' . $row[7] . /* checked */
                   ',"address":' . $row[8] . /* checked */
                   '}';
    }
    $response .= "]";
  }


  echo $response;
  
  mysql_close($db);
?>
