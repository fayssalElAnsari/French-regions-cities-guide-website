<?php
// fichiers requis
set_include_path('..' . PATH_SEPARATOR);
require_once('lib/common_service.php');
require_once('lib/initDataLayer.php');
require_once('lib/fonctions_parms.php');

try {
    // traitement des paramètres
    $insee = checkString('insee', NULL, TRUE);
    // interrogation de la bdd
    $details = $data->getDetails( $insee );
    if (is_null($details)) {
        produceError("code insee incorrect");
    } else {
        // production du résultat
        produceResult($details);
    }
} catch (PDOException $e) {
    produceError($e->getMessage());
} catch (ParmsException $e) {
    produceError($e->getMessage());
}

?>
