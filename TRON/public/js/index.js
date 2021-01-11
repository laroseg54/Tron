/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
/*document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}*/


let boutonPseudo = document.querySelector("#coco");
let inputPseudo = document.querySelector("#toto");
let inputPassword = document.querySelector("#tata");
let inputNewPseudo = document.querySelector("#inputNewPseudo");
let inputNewPassword = document.querySelector("#inputNewPassword");
let moto_color = document.querySelector("#moto_color");
let divPseudo = document.querySelector("#momo");
let form = document.querySelector("#form"); 
let insc = document.querySelector("#insc");
let inscription = document.querySelector("#inscription");
let form_insc = document.querySelector("#form_insc"); 
let retour = document.querySelector("#return");
let carre = document.querySelector("#carre");


document.getElementById("coco").addEventListener("click", submitForm);
document.getElementById("titi").addEventListener("click", submitInsc);

let redirect = document.querySelector("#titi");


//initialiser la liste de moto_color
/* if(localStorage.getItem("fin") == "true"){
    localStorage.removeItem("moto_colors");
    localStorage.removeItem("fin");
}
if(!localStorage.getItem('moto_colors')){
    var moto_colors = [];
    moto_colors.length = 5;
    moto_colors[0] = "value";
    localStorage.setItem("moto_colors", JSON.stringify(moto_colors));
}

var len = document.getElementById('moto_color').options.length;
var colors = JSON.parse(localStorage.getItem("moto_colors"));
for(var i = 0; i < len; i++) {
    for(var j = 1; j < 6; j++) {
        var color = colors[j];
        if(color != null && document.getElementById("moto_color").options[i].value == color ){
            document.getElementById('moto_color').options[i]=null;
            len = document.getElementById('moto_color').options.length;
        }
    }
} */

// affiche le formulaire d'inscription
inscription.onclick = function(event){
        form.style.display = "none";
        insc.style.display = "none";
        form_insc.style.display = "table";
}; 

//redirige vers la page de connexion
retour.onclick = function(event) {
    form.style.display = "table";
    insc.style.display = "table";
    form_insc.style.display = "none";
    
};

//après inscription, redirige vers la page de connexion 
// redirect.onclick = function(event){
//     form.style.display = "table";
//     insc.style.display = "table";
//     form_insc.style.display = "none"; 
// }

//ajax pour le formulaire de connexion
function submitForm(){
    //e.preventDefault();
    console.log("TEST"); 
    fetch('/login',  {
      method: 'post', mode: 'cors', 
      body: JSON.stringify({pseudo: inputPseudo.value, password: inputPassword.value, moto_color: moto_color.value})
    }).then(function(response) {
        if(response.status == 400){
            alert('Vous ne possédez aucun compte, veuillez vous inscrire puis réessayez de vous connecter ! ');
        }
     /*    else {
            for(var j = 1; j < 6; j++) {
                if(colors[j] == null){
                    colors[j] = moto_color.value;
                    break;
                }
            }
            localStorage.setItem("moto_colors", JSON.stringify(colors));
        } */
      return response.json();
    }).then(function(data) {
        
        window.open('/jeu?pseudo=' + inputPseudo.value+'&couleur='+moto_color.value, '_self');
    }).catch(function(err) {
      //Failure
      
      //alert(err);
    });
}

//ajax pour le formulaire d'inscription 
function submitInsc() {
    console.log("submitInsc OK : votre inscription a été effectuée"); 
    fetch('/register', {
        method: 'post', mode: 'cors', 
        body: JSON.stringify({newPseudo: inputNewPseudo.value, password: inputNewPassword.value})
    }).then(function(response) {
        console.log('status: ' + response.status);
        if(response.status == 400){
            alert('Echec de votre inscription !');
        }
        else {
            form.style.display = "table";
            insc.style.display = "table";
            form_insc.style.display = "none"; 
        }
    return response.json();
    }).then(function(data) {
        //window.location.href = '/index.html'; 
        //javascript:window.location.reload(); 
    }).catch(function(err) {
        //Failure
        //alert('err'); 
    });
}
