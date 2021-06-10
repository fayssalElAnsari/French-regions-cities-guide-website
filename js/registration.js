// TODO: combine messages into only one function
// TODO: improve error handling
// TODO: change CSS

window.addEventListener('load', submitevent);
function submitevent(){
  document.forms.form_registration.addEventListener("submit", sendForm);

  
}


// this will be called on form submit 
function sendForm(ev){ // form event listener
    ev.preventDefault();// to stop the page from reloading and doing the default behavior
    // Utilisation de FormData / URLSearchParams
    let args = new FormData(this);// get the data from the THIS form: (forms.form_registration)
    // let queryString = new URLSearchParams(args).toString();
    console.log("args is : " + args.get);
    // console.log("querystring is: " + queryString);

    try{
        showSentMessage();
        fetchFromJson('services/createUser.php', {method:'post', body:args})
        .then(processAnswer)
        .then(showSucessMessage);
    } catch (e){
        console.log(e);
        showErrorMessage();
    }
    
    
  }

  function processAnswer(answer){// answer est un JSON
    // si le status est "ok" va retourner  answer.result sinon elle va cree une erreur avec message
    // result is an array each element of the array references the properties of a Territoire
    // WE NEED TO CATCH THIS ERR INSIDE THE SEND FORM FUNCTION!!!
    if (answer.status == "ok")
      return answer.result;
    else {
        try {
            showErrorMessage("compte existe deja! ");
            throw new Error("error:" + answer.message);
        } catch (err){
            console.log('child error', err)
            throw err;
        }
    }
      
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
    div.classList.add("alert");// add a class 'alert' and 'info' to the created div  info
    div.classList.add("info");
    div.innerHTML = "<span class=\"closebtn\">&times;</span> <strong>Info!</strong> Votre demande a ete prise en compte";
    zoneMessageDiv.appendChild(div);
    manageCloseBtn();
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
    div.classList.add("alert");// add a class 'alert' and 'info' to the created div  info
    div.classList.add("success");
    div.innerHTML = "<span class=\"closebtn\">&times;</span><strong>Success!</strong> Le compte a ete cree avec success";
    zoneMessageDiv.appendChild(div);
    manageCloseBtn();
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
    
    let div = document.createElement('div');
    div.classList.add("alert");
    div.innerHTML = "<span class=\"closebtn\">&times;</span><strong>Error!</strong> Un compte avec le meme identifiant exist deja!";
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

/**
 * this function will send user data using AJAX in js and php (POST)
 * 
 */
/**
 * should we use AJAX??
//  */
// function sendData(){
//     const xhr = new XMLHttpRequest();

//     xhr.onload = function () {
//         showSuccessMessage();
//     }

//     xhr.open("POST", "services/createUser.php");
//     xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

//     let args = new FormData(this);// get the data from the THIS form: (forms.form_communes)
//     let queryString = new URLSearchParams(args).toString();

//     xhr.send(queryString);

// }
