<?php
// this file contains functions called by the services
 date_default_timezone_set ('Europe/Paris');// not important??
 header('Content-type: application/json; charset=UTF-8');// why use the header???

 spl_autoload_register(function ($className) {// datalayer, identitie, parmexception.
    include ("lib/{$className}.class.php");
 });
 
 function answer(array $reponse){
  global $args;// where is this variable defined first??
  if (is_null($args))// is null is the same as those other checks? == NULL OR === NULL
    $reponse['args'] = [];
  else {
    $reponse['args'] = $args->getValues();
    unset($reponse['args']['password']); 
  }
  $reponse['time'] = date('Y-m-d H:i:s');
  echo json_encode($reponse);
 } 
 
 /**
  * Envoie sur la sortie standard le code JSON d'une réponse en erreur (status error)
  * @param $message : texte du message associé
  */
 function produceError(string $message){
    answer(['status'=>'error','message'=>$message]);
 }
 /**
  * Envoie sur la sortie standard le code JSON d'une réponse avec un résultat (status ok)
  * @param $result : résultat (type quelconque)
  */
 function produceResult($result){
    answer(['status'=>'ok','result'=>$result]);
 }

?>
