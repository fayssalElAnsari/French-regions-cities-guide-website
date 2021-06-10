// TODO: later fix the messages and combine them into only one function
// TODO: fix error handling
// TODO: change CSS

window.addEventListener('load',initForm2);
function initForm2(){// will load up the form with the communes :)
    document.forms.form_login.addEventListener("submit", loginForm);

}

// this will be called on form submit 
function loginForm(ev){ // form event listener
    ev.preventDefault();// to stop the page from reloading and doing the default behavior
    // Utilisation de FormData / URLSearchParams
    let args = new FormData(this);// get the data from the THIS form: (forms.form_registration)
    // let queryString = new URLSearchParams(args).toString();
    console.log("args is : " + args.get);
    // console.log("querystring is: " + queryString);

    try{
        fetchFromJson('services/login.php', {method:'post', body:args})
        .then(processAnswer2)
        .then(userLoggedIn);
    } catch (e){
        console.log(e);
        userLoggedOut();
    }
    
  }

  function processAnswer2(answer){// answer est un JSON
    // si le status est "ok" va retourner  answer.result sinon elle va cree une erreur avec message
    // result is an array each element of the array references the properties of a Territoire
    // WE NEED TO CATCH THIS ERR INSIDE THE SEND FORM FUNCTION!!!
    if (answer.status == "ok"){
        console.log(answer.result.nom);
        return answer.result;
    }
    else {
        try {
            showErrorMessage("Coordonnees Incorrectes");
            throw new Error(" error:" + answer.message);
        } catch (err){
            console.log('child error', err)
            throw err;
        }
    }
      
}

function logout(){
    // window.location = "services/logout.php";
    userLoggedOut();
}

function showProfileInfo(profileInfo){
    console.log(profileInfo);
    let nomDiv = document.getElementById("nomDiv");
    nomDiv.innerText= profileInfo.nom;
    let prenomDiv = document.getElementById("prenomDiv");
    prenomDiv.innerText = profileInfo.prenom;
    let loginDiv = document.getElementById("loginDiv");
    loginDiv.innerText = profileInfo.login;
    nomDiv.style.display = "inline";
    prenomDiv.style.display = "inline";
    loginDiv.style.display = "inline";
}

function hideProfileInfo(){
    var nom = document.getElementById("nomDiv");
    nom.style.display = "none";
    var prenom = document.getElementById("prenomDiv");
    prenom.style.display = "none";
    var login = document.getElementById("loginDiv");
    login.style.display = "none";
}

function showLogOutBtn(){
    var logoutBtn = document.getElementById("logout_btn");
    logoutBtn.style.display = "inline";
}

function hideLogOutBtn(){
    console.log("hiding btn");
    var logoutBtn = document.getElementById("logout_btn");
    logoutBtn.style.display = "NONE";
}


/**
 * this function will show all html elements needed
 * when the user is NOT logged in : logging in form, register link
 * and will hide unecessary elements: profile pic, name
 */
function userLoggedIn(profileJson){
    console.log("the user IS logged in!")
    var x = document.getElementById("form_login");
    x.style.display = "none";
    hideErrMsg();
    showLogOutBtn();
    showProfileInfo(profileJson);
}

/**
 * this function will show all html elements needed when the user IS logged in
 */
function userLoggedOut(){
    console.log("the user is NOT logged in!")
    var x = document.getElementById("form_login");
    x.style.display = "inline";
    hideLogOutBtn();
    hideProfileInfo();
    
}


/*
* we want to produce a smilar pattern:
* <div class="alert info">
*    <span class="closebtn">&times;</span>  
*    <strong>Info!</strong> Votre demande a ete prise en compte
*  </div>
*/  
function showSentMessage(tab){// commune type is JSON object?? 
    console.log("called showSentMessage()");
    let zoneMessageDiv = document.querySelector('#zonemessage');// select all elements with id="details" 
    if (zoneMessageDiv == null){
        zoneMessageDiv = document.createElement('div');
        zoneMessageDiv.id="#zonemessage";
     // then appends it to the element with id #details
     // so it will create <div id="zonemessage"><div></div></div>
    }
    
    let div = document.createElement('div');
    let span = document.createElement('span');
    let title = document.createElement('strong');
    title.innerText= "Info!";

    div.classList.add("alert");// add a class 'alert' and 'info' to the created div  info
    div.classList.add("info");

    span.classList.add("closebtn");
    span.innerText= "&times;";

    div.appendChild(span);
    div.appendChild(title);
    div.innerText = "Votre demande a ete prise en compte";
    zoneMessageDiv.appendChild(div);
    
}

/**
 * <div class="alert success">
    <span class="closebtn">&times;</span>  
    <strong>Success!</strong> Le compte a ete cree avec success
  </div>
 * @param {*} tab 
 */
function showSucessMessage(tab){// commune type is JSON object?? 
    console.log("called showSuccessMessage()");
    let zoneMessageDiv = document.querySelector('#zonemessage');// select all elements with id="details" 
    if (zoneMessageDiv == null){
        zoneMessageDiv = document.createElement('div');
        zoneMessageDiv.id="#zonemessage";
     // then appends it to the element with id #details
     // so it will create <div id="zonemessage"><div></div></div>
    }
    
    let div = document.createElement('div');
    let span = document.createElement('span');
    let title = document.createElement('strong');
    title.innerText= "Sucess!";

    div.classList.add("alert");// add a class 'alert' and 'info' to the created div  info
    div.classList.add("success");

    span.classList.add("closebtn");
    span.innerText= "&times;";

    div.appendChild(span);
    div.appendChild(title);
    div.innerText = "Le compte a ete cree avec success!";
    zoneMessageDiv.appendChild(div);
    
}

/*
* we want to produce a smilar pattern:
* <div class="alert info">
*    <span class="closebtn">&times;</span>  
*    <strong>Info!</strong> Votre demande a ete prise en compte
*  </div>
*/
function showErrorMessage(error){// commune type is JSON object?? 
   console.log("called showErrorMessage()");
    let zoneMessageDiv = document.querySelector('#zonemessage');// select all elements with id="details" 
    if (zoneMessageDiv == null){
        zoneMessageDiv = document.createElement('div');
        zoneMessageDiv.id="#zonemessage";
     // then appends it to the element with id #details
     // so it will create <div id="zonemessage"><div></div></div>
    }

    // delete all child nodes
    while (zoneMessageDiv.firstChild){// while it has a firstChild
        zoneMessageDiv.removeChild(zoneMessageDiv.firstChild);
    }

    let div = document.createElement('div');
    div.classList.add("alert");
    div.innerHTML = "<span class=\"closebtn\">&times;</span><strong>Error!</strong> Coordonnees Incorrectes! Nous ne pouvons pas mettre suite a votre demande!";
    zoneMessageDiv.appendChild(div);
    manageCloseBtn();
}

function manageCloseBtn(){
    var close = document.getElementsByClassName("closebtn");
  var i;

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function(){
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function(){ div.style.display = "none"; }, 600);
    }
  }
}

function hideErrMsg(){
    let zoneMessageDiv = document.querySelector('#zonemessage');// select all elements with id="details" 
    // delete all child nodes
    while (zoneMessageDiv.firstChild){// while it has a firstChild
        zoneMessageDiv.removeChild(zoneMessageDiv.firstChild);
    }
}

