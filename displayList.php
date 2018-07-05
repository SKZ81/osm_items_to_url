<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <link rel="stylesheet" type="text/css" href="styles/displayList.css" />
  </head>
  <body>

<?   // AJAX Script
  // database parameters 
  include("config.php");
  
  /* AJAX parameters : minlng,minlat,maxlat,maxlng*/
  
  /* AJAX RESPONSE FORMAT in JSON
  [{"name":"Tunbridge Wells, Langton Road, Burnt Cottage",
    "lon":"0.213102",
    "lat":"51.1429",
    "details":"A Grade II listed five bedroom wing in need of renovation."}*/
  
   
  $db = mysql_connect($sqlhost,$dbuser,$dbpasswd) or die("Can't connect to SQL server");   
  mysql_select_db($db) or die( "Unable to select database");
  mysql_query("set names 'utf8'");

  $query = "SELECT id, name, locLng, locLat, url, comment, interet, checked, address FROM " . $appartsTable;
  //SELECT firstname, lastname, locLat, locLng, (SELECT kindlabel FROM userkind WHERE id=user.kind) FROM users WHERE locLat BETWEEN -90 AND 90 AND locLng BETWEEN -180 AND 180
  //echo $query . "<br>";
  
  $result = mysql_query($query);
  
  $referer = $_SERVER['HTTP_REFERER'];
  if ($referer != "") {
    echo "<div id='backButton'><a id='backButton' href='$referer'><img src='images/icon-back.png' width=20></a></div>";
  }
  
  if ($result != null) {
/*    $response = "[";   
    $firstElement = true; 
    while($row = mysql_fetch_array($result)) {
      if(!$firstElement) {$response .= ",";} else {$firstElement = false;}
      $response .= '{"id":"' . $row[0] . // id 
                   '", "name":"' . $row[1] . // name 
                   '", "lon":"' . $row[2] . //locLng
                   '", "lat":"' . $row[3] . // locLat 
                   '","url":"' . $row[4] . // url, plaintext 
                   '","comment":"' . $row[5] . // comment 
                   '","interet":' . $row[6] . // interet 
                   ',"checked":' . $row[7] . // checked 
                   '}';
    }
    $response .= "]";
    */
    $alt = false;
    echo "<div><table><th>description</th><th>commentaire</th><th>interet</th><th>Contact</th><th>Addr</th><th>Lien</th><th>Loc.</th>";
    while($row = mysql_fetch_array($result)) {
      $id = $row[0];
      $name = $row[1]; 
      $lng =$row[2];
      $lat = $row[3];
      $url = $row[4];
      $comment = $row[5];
      $interet = $row[6];
      $checked = $row[7];
      $address = $row[7];
      
      if ($alt) {
        echo "<tr class='alt'>";
      } else {
        echo "<tr>";
      }
      echo "<td>$name</td><td>$comment</td><td>";
      if ($interet == 1) {
        echo "X";
      }
      echo "</td><td>";
      if ($checked == 1) {
        echo "X";
      }
      echo "</td><td>";
      if ($address == 1) {
        echo "X";
      }
      echo "</td><td><a href='$url' target='_black'><img src='images/icon-link.png' width=32 height=32></a></td>";
      echo "<td><a href='$mapUrl?select=$id&lat=$lat&lng=$lng' title='Localiser sur la carte'><img src='images/home.png'></a></td>";
      echo "</tr>\n";
      $alt ^= true;
    }
    echo "</table></div>";
  }
  


  
  mysql_close($db);
?>

  </body>
</html>
