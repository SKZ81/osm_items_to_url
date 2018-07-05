<?
  include("../config.php");
  include("replaceLF.php");
  /*
  echo "<p>".$_POST["name"]."</p>";
  echo "<p>".$_POST["url"]."</p>";
  echo "<p>".$_POST["locLat"]."</p>";
  echo "<p>".$_POST["locLng"]."</p>";         
  */
  
  $name = $_POST["name"];
  $locLat = $_POST["locLat"];
  $locLng = $_POST["locLng"];
  $url = $_POST["url"];
  $comment = $_POST["comment"];
  $interet = $_POST["interet"];
  $checked = $_POST["checked"];
  $address = $_POST["address"];
  

  /*
  $name = $_GET["name"];
  $locLat = $_GET["locLat"];
  $locLng = $_GET["locLng"];
  $url = $_GET["url"];
  */
  
  $db = mysql_connect($sqlhost,$dbuser,$dbpasswd) or die("Can't connect to SQL server");   
  mysql_select_db($dbname) or die( "Unable to select database");
  mysql_query("set names 'utf8'");
  
  $query = "INSERT INTO $appartsTable (name, locLat, locLng, url, comment, interet, checked, address) VALUES " .
           "('$name',$locLat,$locLng,'$url','" . replaceLF($comment) . "',$interet,$checked,$address)";
  
  if (mysql_query($query)) {
    //echo "<p><b>Appartement enregistré avec suucès !</b></p><br><br>";
    echo "OK";
  } else {
    //echo "<p style='color : red'><b>Problème lors de l'enregistrement de l'appartement...</b></p><br><br>";
    echo "ERROR while executing SQL : " . $query;    
  } 

  mysql_close($db);
?>
