<?   // AJAX Script
  // database parameters 
  include("../config.php");

  /* AJAX parameters : id*/
  $id=$_POST["id"];
  if (id=="") die("must provide plot id");
  
  $db = mysql_connect($sqlhost,$dbuser,$dbpasswd) or die("Can't connect to SQL server");   
  mysql_select_db($db) or die( "Unable to select database");
  mysql_query("set names 'utf8'");
  
  $query = "DELETE FROM " . $appartsTable . " WHERE id=" . $id;
  //SELECT firstname, lastname, locLat, locLng, (SELECT kindlabel FROM userkind WHERE id=user.kind) FROM users WHERE locLat BETWEEN -90 AND 90 AND locLng BETWEEN -180 AND 180
  //echo $query . "<br>";
  
  $result = mysql_query($query);
  
  if ($result == true) {
    echo "OK";
  } else {
    echo "SQL ERROR while removing plot (id=" . $id . "), (SQL : ". $query .")";
  }
  
  mysql_close($db);
?>
  