<?
  include("../config.php");
  include("replaceLF.php");
  
  $id = $_POST["id"];
  $name = $_POST["name"];
  $locLat = $_POST["locLat"];
  $locLng = $_POST["locLng"];
  $url = $_POST["url"];
  $comment = $_POST["comment"];
  $interet = $_POST["interet"];
  $checked = $_POST["checked"];
  $address = $_POST["address"];

  
  $db = mysql_connect($sqlhost,$dbuser,$dbpasswd) or die("Can't connect to SQL server");   
  mysql_select_db($dbname) or die( "Unable to select database");
  mysql_query("set names 'utf8'");
  
  $query = "UPDATE $appartsTable SET locLat=$locLat,locLng=$locLng,name=\"$name\",url=\"$url\"" . 
           ",comment=\"" . replaceLF($comment) . "\",interet=$interet,checked=$checked,address=$address WHERE id=$id";
  //echo $query."<br>";
            
  if (mysql_query($query)) {
    //echo "<p><b>Appartement enregistré avec suucès !</b></p><br><br>";
    echo "OK";
  } else {
    //echo "<p style='color : red'><b>Problème lors de l'enregistrement de l'appartement...</b></p><br><br>";
    //echo "ERROR while executing SQL : " . $query;
    echo $appartsTable;
  } 

  mysql_close($db);
?>
