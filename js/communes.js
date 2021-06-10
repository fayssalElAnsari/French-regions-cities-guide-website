
window.addEventListener('load',initForm);
function initForm(){// will load up the form with the communes :)
  fetchFromJson('services/getTerritoires.php')// the return of fetchFromJson will be passed into processAnswer(return goes here)
  .then(processAnswer)// the return of processAnswer will be passed into makeOptions(return goes here)
  .then(makeOptions);// makeOptions(processAnswer(fetchFromJson('...'))); from inside out only if inside is succesful!
  
  document.forms.form_communes.addEventListener("submit", sendForm);// sans territoire??
  
  // décommenter pour le recentrage de la carte :
  document.forms.form_communes.territoire.addEventListener("change",function(){//when the form form_communes.territoire changes 
   centerMapElt(this[this.selectedIndex]);// selectedIndex starts with 0 (references the index of the selected <option>)
   // here this keyword refers to <option> element???
  });
}

function processAnswer(answer){// answer est un JSON
  // si le status est "ok" va retourner  answer.result sinon elle va cree une erreur avec message
  // result is an array each element of the array references the properties of a Territoire
  if (answer.status == "ok")
    return answer.result;
  else
    throw new Error(answer.message);
}


function makeOptions(tab){// will create the <option> nodes for each tab element
  // tab is an array 
  for (let territoire of tab){  
    let option = document.createElement('option');// <option></option>
    option.textContent = territoire.nom;// <option text="territoire.nom"></option>
    option.value = territoire.id;// <option value="territoire.id" text="territoire.nom"></option> 
    // id of territoire is incremented from 1: (1,2,3, ....)
    // so its value="1" for the first element of tab
    document.forms.form_communes.territoire.appendChild(option);// gets the form with id="form_communes" and name="territoire"
    // then adds a node (option)
    for (let k of ['min_lat','min_lon','max_lat','max_lon']){// ajout des elements data-* dans <option>
      option.dataset[k] = territoire[k];// data-k = "territoire[k]"
      // par ex: data-min_lat="territoire['min_lat']"
    }
  }
}

// this will be called on form submit 
function sendForm(ev){ // form event listener
  ev.preventDefault();// to stop the page from reloading and doing the default behavior
  // Utilisation de FormData / URLSearchParams
  let args = new FormData(this);// get the data from the THIS form: (forms.form_communes)
  let queryString = new URLSearchParams(args).toString();
  console.log("args is : " + args.get);
  console.log("querystring is: " + queryString);
  fetchFromJson('services/getCommunes.php?' + queryString)
      .then(processAnswer)
      .then(makeCommunesItems); 
}

/**
 * TODO: WILL TRY TO CHANGE THE LIST INTO A LIST OF BUTTONS FOR BETTER VISUAL EFFECTS
 */
function makeCommunesItems(tab){
  // récupération de la liste ul connaissant son id
  let liste = document.getElementById('liste_communes');
  // vider la liste
  liste.textContent = "";
  // pour chaque élément du tableau
  
  for (let commune of tab) {
      // créer un item
      let item = document.createElement('li');// <li></li>
      let favouriteIcon = document.createElement('i');
      favouriteIcon.classList.add("far");
      favouriteIcon.classList.add("fa-heart");
      item.textContent = commune.nom+"  ";// <li>commune.nom</li>
      item.appendChild(favouriteIcon);
      // les attributs
      for (let k of ['insee', 'min_lat','min_lon','max_lat','max_lon']) {
          item.dataset[k] = commune[k];// adds data-* as in: <li data-min_lat="commune[min_lat]">commune.nom</li>
      } // commune.attribut ou commune['attribut']
      // Q4 (facultatif)
      item.addEventListener("mouseover",function(){//when the mouse is over the <li> element 
        centerMapElt(this);// this here refers to the item object
       });

      // Q2.2
      item.addEventListener('click', fetchCommune);
      // ajouter à la liste
      liste.appendChild(item);
  }
}

function fetchCommune(ev) {
  let url = 'services/getDetails.php?insee=' + this.dataset.insee;// typo in purpose ? hh
  fetchFromJson(url)
      .then(processAnswer)
      .then(displayCommune);
}


/**
 * I will try to make a table similar to this one:
 * <table class="styled-table">
    <thead>
        <tr>
            <th>Propriete</th>
            <th>Valeur</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>insee</td>
            <td>6000</td>
        </tr>
        <tr class="active-row">
            <td>nom</td>
            <td>Sailly-lez-Lannoy</td>
        </tr>
        <!-- and so on... -->
    </tbody>
</table>
 * which will contian all the details of the selected commune
 */
function displayCommune(commune){
  // commune is an associative array 
  // récupération du div + effacement
  let div = document.getElementById('details');
  // if there is no div it will create one
  if (div == null){
    div = document.createElement('div');
  }
  // make it into a card css
  div.classList.add("property-card");

  // delete all child nodes
  while (div.firstChild){// while it has a firstChild
    div.removeChild(div.firstChild);
  }

  // create the table
  let table = document.createElement('table');
  table.classList.add('styled-table');
  // create the head of the table
  let thead = document.createElement('thead');
  let tr = document.createElement('tr');
  let propriete = document.createElement('th');
  propriete.innerText = "Propriete";
  let valeur = document.createElement('th');
  valeur.innerText = "Valeur";
  tr.appendChild(propriete);
  tr.appendChild(valeur);
  thead.appendChild(tr);
  table.appendChild(thead);

  // create the body of the table
  let tbody = document.createElement('tbody');
  let pair = 0;
  // now div has no child nodes: <div id="details"></div>
  // ajout des détails 
  for (let k of ['insee', 'nom', 'nom_terr', 'surface', 'perimetre', 'pop2016', 'lat', 'lon']){
    // let li = document.createElement('li');
    // li.classList.add("detail_item");
    // li.textContent = k.concat(": ").concat(commune[k]);
    // div.appendChild(li);
    let tr = document.createElement('tr');
    let td_prop = document.createElement('td');
    let td_val = document.createElement('td');
    td_prop.textContent = k;
    td_val.textContent = commune[k];
    tr.appendChild(td_prop);
    tr.appendChild(td_val);
    if (pair % 2 != 0){
      tr.classList.add("active-row");
    }
    tbody.appendChild(tr);
    pair += 1;

  }
  table.appendChild(tbody);
  div.appendChild(table);
  // create geo shape of the commune
  createDetailMap(commune);
}

/**
 * Recentre la carte principale autour d'une zone rectangulaire
 * elt doit comporter les attributs dataset.min_lat, dataset.min_lon, dataset.max_lat, dataset.max_lon, 
 */
function centerMapElt(elt){
  let ds = elt.dataset;// get data-*
  map.fitBounds([[ds.min_lat,ds.min_lon],[ds.max_lat,ds.max_lon]]);
}


/**
 * correction backup
 * function sendForm(ev) { // form event listener
    ev.preventDefault();
    // Utilisation de FormData / URLSearchParams
    let args = new FormData(this);
    let queryString = new URLSearchParams(args).toString();
    fetchFromJson('sercices/getCommunes.php' + queryString)
        .then(processAnswer)
        .then(makeCommunesItems); 
}

function makeCommunesItems(tab) {
    // récupération de la liste ul connaissant son id
    let liste = document.getElementById('liste_communes');
    // vider la liste
    liste.textContent = "";
    // pour chaque élément du tableau
    for (let commune of tab) {
        // créer un item
        let item = document.createElement('li');
        item.textContent = commune.nom;
        // les attributs
        for (let k of ['insee', 'min_lat','min_lon','max_lat','max_lon']) {
            item.dataset[k] = commune[k];
        } // commune.attribut ou commune['attribut']
        // ajouter à la liste
        liste.appendChild(item);
    }
}

// à ajouter dans makeCommunesItems
item.addEventListener('click', fetchCommune);

function fetchCommune(ev) {
    let url = 'services/getDtails.php?insee=' + this.dataset.insee;
    fetchFromJson(url)
        .then(processAnswer)
        .then(displayCommune);
}
function displayCommune(commune) {
    // récupération du div + effacement
    // ajout des détails 
}

 */