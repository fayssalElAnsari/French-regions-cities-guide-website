<?php
 require_once('etc/dsn_filename.php');
 // by using require_once() we make sure to only include this file one time
 // if the file is already included nothing is done
 $data = new DataLayer(DSN_FILENAME);
 // this is the whole purpose of this file: initDataLayer.php will initialize 
 // a DataLayer object by using the info inside the dsn_filename
 // the info inside the DSN_FILENAME constant is simply the path to the webtp_dsn.txt file
?>
