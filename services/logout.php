<?php
spl_autoload_register(function ($className) {
     include ("lib/{$className}.class.php");
 });
require('lib/initDataLayer.php');
require_once('lib/watchdog.php');
unset($_SESSION['ident']);
session_destroy();
require('views/pagelogout.php');
require('views/pagePrincipale.php');
?>
