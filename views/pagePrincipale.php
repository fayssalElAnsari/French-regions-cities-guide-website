<?php

?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
  <head>
    <meta charset="UTF-8"/>
    <title>Communes de la MEL</title>
    <link rel="stylesheet" type="text/css" href="style_td6.css" />
    <script src="js/fetchUtils.js"></script>
    <script src="js/communes.js"></script>
    <script src="js/carte.js"></script>
    <script src="js/login.js"></script>

    <!-- the font icon library -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="https://use.fontawesome.com/releases/v5.15.1/js/all.js"></script>
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
   integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
   crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
   integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
   crossorigin=""></script>

  </head>
<body>
<header>
<h1>
Communes de la MEL
</h1>
<!-- <div class="links">
  <a href="register.php" onclick="">register</a>
  <a href="login.php" onclick="loginFn()">login</a>
  <a href="logout.php" onclick="">logout</a>
  <a href="" onclick="">edit profile pic</a>
  <a href="" onclick="">favourites <3</a>
</div> -->

</header>
<section id="main">
  <div id="zonemessage"></div>
<div class="container">
  <form id="form_login" action="">
  <fieldset>
    <label for="login">Login :</label>
    <input type="text" name="login" id="login" required="required" autofocus/>
    <label for="password">Mot de passe :</label>
    <input type="password" name="password" id="password" required="required" />
    <button type="submit" name="valid">OK</button>
  </fieldset>
    <p>Pas encore inscrit ? <a href="register.php">créez un compte.</a></p>
  </form>
  <p id="loginDiv" class="login_p"></p></br>
  <p id="nomDiv" class="id_p"></p>
  <p id="prenomDiv" class="prenom_p"></p>
  
  <button id="logout_btn" onclick="logout()">Logout</button>
</div>
  <div id="choix">
    <form id="form_communes" action="">
      <fieldset>
        <legend>Choix des communes</legend>
        <label>Territoire :
          <select name="territoire">
              <option value=""
                      data-min_lat="50.499" data-min_lon="2.789"
                      data-max_lat="50.794" data-max_lon="3.272"
              >
                Tous
              </option>
              <!-- les autres options seront crées en JS -->
          </select>
        </label>
</br>
        <label>nom :
          <input name="nom">
              
          </input>
        </label>
        </br>
        <label>surface minimale :
          <input  name="surface_min">
              
          </input>
        </label>
        </br>
        <label>population minimale :
          <input  name="pop_min">
              
          </input>
        </label>
        </br>
        <label>FAV seulement : 
          
          <input type="checkbox" id="fav_seul" name="favourites">
        </label>
        </fieldset>
      <button class="buttonBlack" type="submit">Afficher la liste</button>
    </form>
  </div>
  <div id='carte'></div>
  <ul id="liste_communes">
</ul>

  
  <div id="details"></div>
  <!-- communes.js will populate details here -->
</section>

<!-- <footer class="footer">
<a href="logout.php">Se déconnecter</a> <a href="formUpload.php">Changer d'avatar</a>
</footer>  -->
</body>
</html>
