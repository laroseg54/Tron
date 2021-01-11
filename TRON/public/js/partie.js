const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let grille = document.getElementById("grille");
let textInfo = document.getElementById("textInfo");
let motos = [];
let pseudoJoueur = urlParams.get('pseudo');
let couleurJoueur = urlParams.get('couleur');
let motoJoueur;
let fin;
let HOST = location.origin.replace(/^http/, 'ws')
let Socket = new WebSocket(HOST);
let platform = document.getElementById("platform").innerText;


//afficher les joueurs et les scores 
let j1 = document.getElementById("j1");
let j2 = document.getElementById("j2");
let j3 = document.getElementById('j3');
let j4 = document.getElementById('j4');
let winner = document.getElementById("gagnant");

let partie = document.querySelector("#partie");
let stats = document.querySelector("#stats");
let buttonStats = document.querySelector("#buttonStats");
let statsReturn = document.querySelector("#statsReturn");

//afficher les statistiques 
let statsJ1 = document.getElementById('statsJ1');
let nb_winJ1 = document.getElementById('nb_winJ1');
let nb_lostJ1 = document.getElementById('nb_lostJ1');

let statsJ2 = document.getElementById('statsJ2');
let nb_winJ2 = document.getElementById('nb_winJ2');
let nb_lostJ2 = document.getElementById('nb_lostJ2');

let statsJ3 = document.getElementById('statsJ3');
let nb_winJ3 = document.getElementById('nb_winJ3');
let nb_lostJ3 = document.getElementById('nb_lostJ3');

let statsJ4 = document.getElementById('statsJ4');
let nb_winJ4 = document.getElementById('nb_winJ4');
let nb_lostJ4 = document.getElementById('nb_lostJ4');

let rejouer = document.querySelectorAll(".replay");
rejouer.forEach(elem => {
    elem.onclick = () => {
        window.location.reload();
    }
});

if(platform=="ordinateur" || platform=="browser") {
    document.querySelector('#classement').style.fontSize="15px";
}

//bouton qui donne accès aux statistiques de chaque joueur de la partie 
buttonStats.onclick = function (event) {
    partie.style.display = "none";
    document.querySelector("#classement").style.display="none";
    stats.style.display = "inline";
}

//retour aux informations de la dernière partie finie
statsReturn.onclick = function (event) {
    partie.style.display = "inline";
    document.querySelector("#classement").style.display="block";
    stats.style.display = "none";
}



function touches() {
    if (platform == "ordinateur"||platform == "browser") {
        window.onkeydown = (event) => {
            switch (event.key) {
                case "ArrowLeft":

                    moveGauche(event);
                    break;
                case "ArrowRight":

                    moveDroite(event);
                    break;
                case "ArrowUp":
                    moveHaut(event);
                    break;
                case "ArrowDown":
                    moveBas(event);
                    break;
            };
        };
    }
    var toucheGauche = document.getElementById("toucheGauche");
    var toucheHaut = document.getElementById("toucheHaut");
    var toucheDroite = document.getElementById("toucheDroite");
    var toucheBas = document.getElementById("toucheBas");

    toucheGauche.addEventListener("click", moveGauche, false);
    toucheHaut.addEventListener("click", moveHaut, false);
    toucheDroite.addEventListener("click", moveDroite, false);
    toucheBas.addEventListener("click", moveBas, false);
}




function getPosition(obj) {
    var position = []
    position.x = document.getElementById(obj).offsetLeft
    position.y = document.getElementById(obj).offsetTop
    return position
}

function addMoto(pseudo, couleur, direction, x, y, stats) {

    let moto = new Moto(pseudo, couleur, grille, direction, x, y, stats);
    motos.push(moto);
    if (moto.pseudo == pseudoJoueur) {
        motoJoueur = moto;
    }

}

function moveGauche(evt) {
    envDirectionServeur("gauche");
};

function moveHaut(evt) {

    envDirectionServeur("haut");
};

function moveDroite(evt) {

    envDirectionServeur("droite");

};

function moveBas(evt) {

    envDirectionServeur("bas");

};

function envDirectionServeur(direction) {
    let directionInverseH = motoJoueur.direction == "droite" ? "gauche" : motoJoueur.direction == "gauche" ? "droite" : undefined;
    let directionInverseV = motoJoueur.direction == "haut" ? "bas" : motoJoueur.direction == "bas" ? "haut" : undefined;
    if (direction != directionInverseH && direction != directionInverseV) {

        Socket.send(JSON.stringify({
            pseudo: motoJoueur.pseudo,
            statut: "enJeu",
            etat: "vivant",
            direction: direction
        }));
    }
}

function updatePos() {

    motos.forEach(moto => {
        if (moto.etat == "mort") {
            return;
        }
        if (moto.direction == "gauche") {
            moto.addWall(0.2, 2, 1.9, 0);
            moto.motoGraphique.style.webkitTransform = "translateX(-0.2%)";
            moto.x = moto.x - 0.2
            drawMoto(moto);
        }
        if (moto.direction == "haut") {
            moto.addWall(2, 0.2, 0, 1.9);
            moto.motoGraphique.style.webkitTransform = "translateY(-0.2%)";
            moto.y = moto.y - 0.2
            drawMoto(moto);
        }
        if (moto.direction == "droite") {
            moto.addWall(0.2, 2, 0, 0);
            moto.motoGraphique.style.webkitTransform = "translateX(0.2%)";
            moto.x = moto.x + 0.2
            drawMoto(moto);
        }
        if (moto.direction == "bas") {
            moto.addWall(2, 0.2, 0, 0);
            moto.motoGraphique.style.webkitTransform = "translateY(0.2%)";
            moto.y = moto.y + 0.2
            drawMoto(moto);
        }
    });

}

function drawMoto(moto) {
    moto.motoGraphique.setAttribute('x', moto.x);
    moto.motoGraphique.setAttribute('y', moto.y);
}






function isCollision() {
    let x1Moto = Math.round(motoJoueur.x * 10) / 10
    let x2Moto = Math.round((parseFloat(motoJoueur.x) + 2) * 10) / 10
    let y1Moto = Math.round(parseFloat(motoJoueur.y) * 10) / 10
    let y2Moto = Math.round((parseFloat(motoJoueur.y) + 2) * 10) / 10
    //console.log("coordonées moto : "+x1Moto,x2Moto,y1Moto,y2Moto)

    var walls = document.getElementsByClassName("uWall")
    for (var i = 0; i < walls.length; i++) {
        let x1Wall = Math.round((parseFloat(walls[i].getAttribute("x"))) * 10) / 10
        let x2Wall = Math.round((parseFloat(x1Wall) + parseFloat(walls[i].getAttribute("width"))) * 10) / 10
        let y1Wall = Math.round(parseFloat(walls[i].getAttribute("y")) * 10) / 10
        let y2Wall = Math.round((parseFloat(y1Wall) + parseFloat(walls[i].getAttribute("height"))) * 10) / 10
        //console.log("coordonées mur : "+x1Wall,x2Wall,y1Wall,y2Wall)
        if (x1Moto > 0 && x2Moto < 100 && y1Moto > 0 && y2Moto < 100) { } else {
            Socket.send(JSON.stringify({
                pseudo: motoJoueur.pseudo,
                statut: "enJeu",
                etat: "mort"
            }));
            motoJoueur.etat = "mort";
            return;
        }

        if (x1Wall >= x2Moto || x2Wall <= x1Moto || y1Wall >= y2Moto || y2Wall <= y1Moto) { } else {
            Socket.send(JSON.stringify({
                pseudo: motoJoueur.pseudo,
                statut: "enJeu",
                etat: "mort"
            }));
            motoJoueur.etat = "mort";
            return;
        }
    }
    var motosCol = document.getElementsByClassName("motoC")
for (var i = 0; i < motosCol.length; i++) {
    let x1MotoC = Math.round((parseFloat(motosCol[i].getAttribute("x"))) * 10) / 10
    let x2MotoC = Math.round((parseFloat(x1MotoC) + parseFloat(motosCol[i].getAttribute("width"))) * 10) / 10
    let y1MotoC = Math.round(parseFloat(motosCol[i].getAttribute("y")) * 10) / 10
    let y2MotoC = Math.round((parseFloat(y1MotoC) + parseFloat(motosCol[i].getAttribute("height"))) * 10) / 10

    if (x1Moto == x1MotoC && y1Moto == y1MotoC) { }
    else {
        if (x1MotoC >= x2Moto || x2MotoC <= x1Moto || y1MotoC >= y2Moto || y2MotoC <= y1Moto) { } else {
            Socket.send(JSON.stringify({
                pseudo: motoJoueur.pseudo,
                statut: "enJeu",
                etat: "mort"
            }));
            motoJoueur.etat = "mort";
            return;
        }
    }
}

}


/* function main(tFrame) {
    if(!fin){
        updatePos();
        isCollision();
        
        window.requestAnimationFrame(main);
    }

}
 */

function addStatsJoueurs(){
    if (motos[0]) {
        //affiche le pseudo du premier joueur connecté
        j1.innerHTML = "Joueur n°1 : " + motos[0].pseudo;
        j1.style.color = motos[0].couleur;

        //affiche les stats du premier joueur
        statsJ1.innerHTML = "Stats joueur n°1 : " + motos[0].pseudo;
        nb_winJ1.innerHTML = "win : " + motos[0].stats.nb_win;
        nb_lostJ1.innerHTML = "lost : " + motos[0].stats.nb_lost;
    }
    else{
        document.querySelectorAll(".j1").forEach(elem => {
            elem.innerHTML = "";
        })
    }

    if (motos[1]) {
        //affiche le pseudo du second joueur connecté
        j2.innerHTML = "Joueur n°2 : " + motos[1].pseudo;
        j2.style.color = motos[1].couleur;
        //affiche les stats du second joueur
        statsJ2.innerHTML = "Stats joueur n°2 : " + motos[1].pseudo;
        nb_winJ2.innerHTML = "win : " + motos[1].stats.nb_win;
        nb_lostJ2.innerHTML = "lost : " + motos[1].stats.nb_lost;
    }
    else{
        document.querySelectorAll(".j2").forEach(elem => {
            elem.innerHTML = "";
        })
    }


    if (motos[2]) {
        //affiche le pseudo du troisième joueur connecté
        j3.innerHTML = "Joueur n°3 : " + motos[2].pseudo;
        j3.style.color = motos[2].couleur;
        //affiche les stats du troisième joueur
        statsJ3.innerHTML = "Stats joueur n°3 : " + motos[2].pseudo;
        nb_winJ3.innerHTML = "win : " + motos[2].stats.nb_win;
        nb_lostJ3.innerHTML = "lost : " + motos[2].stats.nb_lost;
    }
    else{
        document.querySelectorAll(".j3").forEach(elem => {
            elem.innerHTML = "";
        })
    }

    if (motos[3]) {
        //affiche le pseudo du dernier joueur connecté
        j4.innerHTML = "Joueur n°4 : " + motos[3].pseudo;
        j4.style.color = motos[3].couleur;
        //affiche les stats du dernier joueur
        statsJ4.innerHTML = "Stats joueur n°4 : " + motos[3].pseudo;
        nb_winJ4.innerHTML = "win : " + motos[3].stats.nb_win;
        nb_lostJ4.innerHTML = "lost : " + motos[3].stats.nb_lost;
    }
    else{
        document.querySelectorAll(".j4").forEach(elem => {
            elem.innerHTML = "";
        })
    }

}


Socket.onopen = function (event) {

    Socket.send(JSON.stringify({
        couleur: couleurJoueur,
        pseudo: pseudoJoueur,
        statut: "initialisation"
    }));
    touches();

};
Socket.onmessage = function (event) {
    let data = JSON.parse(event.data);

    switch (data.gameStatut) {
        case "Go":
            fin = false;
            textInfo.style.display = "none";
            //window.requestAnimationFrame(main);
            break;
        case "Attente":
            let jp = new Map(data.joueursPresents);
            //console.log(jp);
            for (const [pseudo, infoDep] of jp.entries()) {
                console.log(infoDep.posDepart);
                addMoto(pseudo, infoDep.couleur, infoDep.posDepart.dir, infoDep.posDepart.x, infoDep.posDepart.y, infoDep.stats);
            }
            addStatsJoueurs();

            break;
        case "NewPlayer":
            addMoto(data.joueurPseudo, data.joueurCouleur, data.joueurPos.dir, data.joueurPos.x, data.joueurPos.y, data.joueurStats);
            console.log(data.joueurStats);
            textInfo.innerHTML = "En attente d'autres joueurs";
            textInfo.style.display = "inline";

            addStatsJoueurs();


            break;
        case "quitterFile":
            // si un joueur quitte la file d'attente avant que la partie soit lancée , on l'enleve de la grille
            let m = motos.find(moto => moto.pseudo == data.joueurPseudo);
            m.motoGraphique.remove();
            motos = motos.filter(moto => moto.pseudo != data.joueurPseudo);
            m = null;
            addStatsJoueurs();
            break;
        case "Starting":
            textInfo.innerHTML = data.message;
            textInfo.style.display = "inline";
            break;
        case "JeuEnCours":
            let directions = new Map(data.directions);
            motos.forEach(moto => {
                moto.setDirection(directions);
            });
            updatePos();
            isCollision();


            break;
        case "JeuFini":
            fin = true;
            rejouer.forEach(elem => {
                elem.style.display = "inline"
            });
            //window.cancelAnimationFrame(main);
            //textInfo.innerHTML = "Le gagnant est " + data.gagnant;
            //textInfo.style.display = "inline";
            var newtxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            newtxt.setAttributeNS(null, 'x', '25');
            newtxt.setAttributeNS(null, 'y', '45');
            newtxt.setAttributeNS(null, 'font-size', '25%');
            newtxt.setAttributeNS(null, 'fill', '#FFD700');
            console.log(data.gagnant);
            if(data.gagnant=="null"){
                newtxt.innerHTML = "Match nul";
                newtxt.setAttributeNS(null, 'x', '40');
            }
            else{
                newtxt.innerHTML = "Le gagnant est " + data.gagnant;
            }
           
            grille.appendChild(newtxt);

            //affiche le gagnant et les scores à la fin d'une partie
            winner.innerHTML = "Gagnant : " + data.gagnant;

            /*            scoreJ1.innerHTML = "Score : ";
            
                        if (motos[1]) {
                            scoreJ2.innerHTML = "Score : ";
                        }
            
            
                        if (motos[2]) {
                            scoreJ3.innerHTML = "Score : ";
                        }
            
                        if (motos[3]) {
                            scoreJ4.innerHTML = "Score : ";
                        } */

            localStorage.setItem('fin', 'true');
            break;

    }

};

Socket.onclose = () => {
    //window.cancelAnimationFrame(main);
    fin = true;

};



//document.addEventListener('DOMContentLoaded', () => window.requestAnimationFrame(main));