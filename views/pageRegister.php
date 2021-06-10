<?php
/*
  Si la variable globale $erreurCreation est définie, un message d'erreur est affiché
  dans un paragraphe de classe 'message'
*/
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
  <head>
    <meta charset="UTF-8"/>
    <link rel="stylesheet" type="text/css" href="style_td6.css" />
    <title>Création d'utilisateur</title>
    <script src="js/fetchUtils.js"></script>
    <script src="js/registration.js"></script>
</head>
<body>
<h2>Demande de création d'un utilisateur</h2>

<?php
 if (isset($erreurCreation) && $erreurCreation)
   echo "<p class='message'>Le compte n'a pas pu être créé</p>";
?>

<form id="form_registration" method="POST" action="">
 <fieldset>
   <label for="nom">Nom :</label>
   <input type="text" name="nom" id="nom" required="required" autofocus/>
   <label for="prenom">Prénom :</label>
   <input type="text" name="prenom" id="prenom" required="required" autofocus/>
   <label for="login">Login :</label>
   <input type="text" name="login" id="login" required="required" autofocus/>
  <label for="password">Mot de passe :</label>
  <input type="password" name="password" id="password" required="required" />
  <button type="submit" name="valid" value="bouton_valid">OK</button>
 </fieldset>
</form>

<!-- this will be populated with registration.js -->
<div id="zonemessage">
  <!-- <div class="alert info">
    <span class="closebtn">&times;</span>  
    <strong>Info!</strong> Votre demande a ete prise en compte
  </div>

  <div class="alert success">
    <span class="closebtn">&times;</span>  
    <strong>Success!</strong> Le compte a ete cree avec success
  </div>

  <div class="alert">
  <span class="closebtn">&times;</span>  
  <strong>Danger!</strong> Nous ne pouvons pas mettre suite a votre demande veuillez ressayer ulterieurement! -->
</div>


<script>
  var close = document.getElementsByClassName("closebtn");
  var i;

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function(){
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function(){ div.style.display = "none"; }, 600);
    }
  }
</script>


</body>
</html>
