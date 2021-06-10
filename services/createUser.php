<?php
set_include_path('..' . PATH_SEPARATOR . get_include_path());

spl_autoload_register(function ($className) {
     include ("lib/{$className}.class.php");
 });

require_once('lib/common_service.php');// to call functions that will return the JSON (shared by all services)
require_once('lib/initDataLayer.php');// to use $data and make requests to the db
require_once('lib/fonctions_parms.php');// to do variable processing before doing requests

try {
  // require_once('lib/common_service.php');
  // require('lib/initDataLayer.php');
  // require('lib/fonctions_parms.php');
  
   // à compléter
   $login = checkString("login", NULL, true);
   $password = checkString("password", NULL, true);
   $nom = checkString("nom", NULL, true);
   $prenom = checkString("prenom", NULL, true);

   $res = $data->createUser($login, $password, $nom, $prenom);
   if ($res){
    //  require('views/pageCreateOK.php');
     produceResult($res);
     exit();
   } else {
    //  $erreurCreation = true;
    //  require('views/pageRegister.php');
     produceError($res);
     exit();
   }
 } catch (ParmsException $e) {
   echo $e;
 }

?>
