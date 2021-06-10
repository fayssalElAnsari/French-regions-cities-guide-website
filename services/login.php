<?php

// fichiers requis
set_include_path('..' . PATH_SEPARATOR);
require_once('lib/common_service.php');
require_once('lib/initDataLayer.php');
require_once('lib/fonctions_parms.php');

try {
    // traitement des paramètres
    $login = checkString('login', NULL, TRUE);
    $password = checkString('password', NULL, TRUE);
    // interrogation de la bdd
    $user = $data->authentification( $login, $password );
    if (is_null($user)) {
        produceError("code insee incorrect");
    } else {
        // production du résultat
        produceResult($user);
    }
} catch (PDOException $e) {
    produceError($e->getMessage());
} catch (ParmsException $e) {
    produceError($e->getMessage());
}


?>