<?php
// fichiers requis
set_include_path('..' . PATH_SEPARATOR . get_include_path());
// this is where the include functions (even require_once()) will look for files in
// so in this case it's the parent folder (seance6)
// PATH_SEPERATOR IS A PREDEFINED CONSTANT Its value is ':' on a UNIX system and ';' on a Windows system.
// not the same as DIRECTORY_SEPERATOR
// doesn't make any sence to use PATH_SEPERATOR for only one path
// so I added the get_include_path()
require_once('lib/common_service.php');// to call functions that will return the JSON (shared by all services)
require_once('lib/initDataLayer.php');// to use $data and make requests to the db
require_once('lib/fonctions_parms.php');// to do variable processing before doing requests

try {
    // traitement des paramètres
    $territoire = checkUnsignedInt('territoire', NULL, FALSE);
    $nom = checkString('nom', NULL, FALSE);
    $surface_min = checkUnsignedInt('surface_min', NULL, FALSE);
    $pop_min = checkUnsignedInt('pop_min', NULL, FALSE);
    // checkUnsignedInt is in fonctions_parms.php
    // will read from POST OR GET and do some checking before returning the value   
    // will get the code of territoire passed by the user to later getCommunes()

    // interrogation de la bdd
    $communes = $data->getCommunes( $territoire, $nom, $surface_min, $pop_min );
    // $data is in initDataLayer.php it is a DataLayer object
    // getCommunes is in the DataLayer.class.php
    // so whenever we require_once('lib/initDataLayer.php') we will require the $data variable if not already required
    // production du résultat
    produceResult($communes);//common_services.php
} catch (PDOException $e) {
    produceError($e->getMessage());//common_services.php
} catch (ParmsException $e) {
    produceError($e->getMessage());
}
?>
