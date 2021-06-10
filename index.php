<?php
spl_autoload_register(function ($className) {
     include ("lib/{$className}.class.php");
 });

require('lib/initDataLayer.php');
require('views/pagePrincipale.php');
require_once('lib/watchdog.php'); // sentinelle


?>
