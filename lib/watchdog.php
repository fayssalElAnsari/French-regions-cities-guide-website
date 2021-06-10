<?php

  /* Sentinelle :
   *  Pour un utilisateur non authentifié, une page d'erreur est envoyée et
   *  le script global est arrêté définitivment (exit)
   */
  
  
 //session_save_path(__DIR__);
 session_name('ma_session');
 session_start();
 
 /**
  * test si le script s'exécute dans une session où l'utilisateur s'est déjà authentifié
  * se fonde sur le témoin d'authentification : $_SESSION['ident']
  */
 function alreadyLogged() : bool {
  echo '<script type="text/javascript">',
  'userLoggedIn();',
  '</script>';
   return isset($_SESSION['ident']); 
 }
 
 /**
  * tente de réaliser une nouvelle connexion
  * - si des identifiants valides ont été fournis dans $_POST, la connexion est réussie
  *    et l'identité de l'utilisateur est rangée dans $_SESSION['ident']
  * @param $authent_function  fonction d'authentification de profil function(login, password) : Identite
  * @return false si connexion échouée, true si résussie
  */
 function tryConnect(callable $authent_function) : bool {
   if ( !isset($_POST['login']) || !isset($_POST['password']) ) // pas de login ou pas de password fourni => échec
    //  $_SESSION['echec'] = TRUE; // not here !!
     return FALSE;
    
   $person = $authent_function($_POST['login'],$_POST['password']);
   if ($person === NULL) {// authentification en échec
     $_SESSION['echec'] = TRUE;
     return FALSE;
   }
   // authentification réussie
   $_SESSION['echec'] = FALSE;
   unset($_SESSION['echec']);
   $_SESSION['ident'] = $person;
   return TRUE;
 }
 
 
 
 $my_authent = [$data,"authentification"];  // méthode d'authentification à 
//  $my_authent = [$data,"authentification"];  // méthode d'authentification à 

 
 if (! alreadyLogged() && ! tryConnect($my_authent)){ // pas déja loggé et pas de connexion correcte
    //  require('views/pageLogin.php');
    //  exit; // Important !
    echo '<script type="text/javascript">',
     'userLoggedOut();',
     '</script>';
;
 }
?>
