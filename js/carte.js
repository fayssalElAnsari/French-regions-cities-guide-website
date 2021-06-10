
let map;//with let the variable is scoped to the immediate closing block denoted by {}, will hold the map later
window.addEventListener('DOMContentLoaded', ()=>{// window is the current window; addEventListener to window(target), 
     //the event is DOMContentLoaded fires when the initial HTML document has been completely loaded and parsed
     //without waiting for stylesheets, images and subframes to finish loading
     //()=> arrow function with certain limitations; to be called on Event
  map = L.map('carte').fitBounds([[50.5,2.789],[50.795,3.272]]);//Leaflet library for showing maps in js.
  //'carte' is the ID of the div element
  //fitBounds() takes in an array of two points, each point is an array of two floats 
  //the first point is a upper left and the second is the lower right 
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {// without a tileLayer the map will be empty, url copied for openstreet maps
       attribution: '©️ Al Ansari and Co'// just giving credit where it's due
  }).addTo(map);// adds the tilelayer used to the map object previously created
});

function createDetailMap(commune){// commune type is JSON object?? 
 let div = document.querySelector('#details div.map');// select all elements with id="details" 
 // && div elements with class="map" if there is none returns NULL meaning: <.. id="details"> <div class='map'> </div></..>
 // in pagePrincipale.php we have: <div id="details"></div> but it doesn't have the class map so nothing is selected
 // at the first page load we have: div = NULL
 if (div == null){// if there is no elements found with prior conds
  div = document.createElement('div');// create a new div element (creates an element with the specified tag('div'))
  // so now we have <div></div>
  document.getElementById('details').appendChild(div);// removes the node (div) from its parent if it has one 
  // then appends it to the element with id #details
  // so it will create <div id="details"><div></div></div>
 }
 div.classList.add('map');// add a class 'map' to the created div
 //  <div id="details">
 //       <div class="map"> 
 //       </div>
 //  </div>
 // this should be inside the if condition because we already try to select the div with class map and id details unless
 // there is no element with id details but we know there is in: pagePrincipale.php
 let dmap = L.map(div);// initialize a map in the processed div object :) here we use dmap as in DetailsMap
 L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { 
       attribution: '©️ <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(dmap);// u know what this is ... 
 let group = L.featureGroup().addTo(dmap); 
 let geo = JSON.parse(commune.geo_shape);
 L.geoJSON([geo]).addTo(group);
 dmap.fitBounds(group.getBounds());
}