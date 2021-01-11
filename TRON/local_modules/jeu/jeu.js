const mongoose = require("mongoose");
const JeuDb = require("./jeuDB");
class Jeu {

    constructor() {

        this.joueurs = [];
        this.posDeparts = [{
            x: 15,
            y: 15,
            dir: "droite"
        }, {
            x: 85,
            y: 85,
            dir: "gauche"
        }, {
            x: 85,
            y: 15,
            dir: "bas"
        },
        {
            x: 15,
            y: 85,
            dir: "haut"
        }
        ]
        this.posLibres = Array.from(this.posDeparts);
        this.enCours = false;
    }

    async addJoueur(joueur) {

        let posDepart = this.posLibres[0];
        this.posLibres.shift();
        this.joueurs.push(joueur);
        JeuDb.find(joueur).then((user) => {
            joueur.setInfosDepart({
                posDepart: posDepart,
                couleur: joueur.couleur,
                stats: { nb_win: user.nb_win, nb_lost: user.nb_lost, highestScore: user.highestScore }
            });
            this.broadcast(JSON.stringify({
                gameStatut: "NewPlayer",
                joueurCouleur: joueur.couleur,
                joueurPseudo: joueur.pseudo,
                joueurPos: posDepart,
                joueurStats: joueur.infosDepart.stats

            }));


        })



    }

    start() {
      /*   On lance un compteur de 10 secondes avant le début de la partie pour que les joueurs puissent se préparer
        La promesse est nécessaire car sinon la partie était lancé avant la fin du compteur */
        let i = 1;
        let timer = () => {
            return new Promise((resolve, reject) => {
                const interval = setInterval(() => {
                    this.broadcast(JSON.stringify({
                        gameStatut: "Starting",
                        joueurs: Array.from(this.joueurs).map(joueur => joueur.pseudo),
                        message: "debut dans " + (11 - i) + " secondes"
                    }));
                    i++;
                    if (i == 11) {
                        clearInterval(interval);
                        resolve();
                    }

                }, 1000);
            });
        };

        timer().then(() => {

            this.broadcast(JSON.stringify({
                gameStatut: "Go",
                joueurs: Array.from(this.joueurs).map(joueur => joueur.pseudo)
            }));
            this.joueurs.forEach(joueur => joueur.ws.enGame = true);
            this.Jouer();
        });
    }

    Jouer() {
        this.enCours = true;
        const interval = setInterval(() => {
            let nbJoueursEnVie = this.joueurs.length;
            let mapDirJoueurs = new Map();
            let gagnant;
            this.joueurs.forEach(joueur => {
                mapDirJoueurs.set(joueur.pseudo, joueur.direction);
                //console.log("jetat "+joueur.etat+" jpseudo"+joueur.pseudo);
                if (joueur.etat == "mort") {
                    nbJoueursEnVie--;
                    //console.log(nbJoueursEnVie);                     
                } else {
                    gagnant = joueur.pseudo;
                }

               
            });
           
            if (nbJoueursEnVie == 1||nbJoueursEnVie==0) {
                clearInterval(interval);
                this.broadcast(JSON.stringify({
                    gameStatut: "JeuFini",
                    gagnant: nbJoueursEnVie==1?gagnant:"null"
                }));
                this.joueurs.forEach(joueur => {
                    joueur.ws.jeuFini = true; // cette ligne sert à eviter qu'un joueur qui se deconnecte une fois la partie finie soit traité par l'objet
                    JeuDb.finPartie(joueur, gagnant);
                });


            } 
            else {
                this.broadcast(JSON.stringify({
                    gameStatut: "JeuEnCours",
                    directions: [...mapDirJoueurs],
                }));
            }

        }, 50);
    }

    sendJoueurs(joueur) {
        /* Cette méthode est appelée quand un joueur se connecte et qu'il y a déja des autres joueurs
        dans la file d'attente. On envoie alors au nouveau client les informations sur les joueurs
        déja présent afin qu'il les ajoutent dans sa grille */

        let mapJoueurs = new Map();
        this.joueurs.forEach(joueur => {
            mapJoueurs.set(joueur.pseudo, joueur.infosDepart);
        });
       
        joueur.ws.send(JSON.stringify({
            gameStatut: "Attente",
            joueursPresents: [...mapJoueurs],
        }));

    }

    broadcast(message) {

        this.joueurs.forEach(joueur => {

            joueur.ws.send(message);

        });
    }

}

module.exports = Jeu;
