const Jeu = require("./jeu.js");
const Joueur = require("./joueur.js");
const JeuDb = require("./jeuDB");

class FileAttente {


    constructor() {
        JeuDb.dropPlayers();
        this.jeu = new Jeu();
        this.jeux = [];
        this.jeux.push(jeu);
        
    }

    entrerDansFile(data, ws) {

        
        let joueur = new Joueur(ws, data.pseudo,data.couleur);
        if (this.jeu.joueurs.length < 4) {
            if(this.jeu.joueurs.length>0){
                this.jeu.sendJoueurs(joueur);
            }
            this.jeu.addJoueur(joueur);
        }
        if (this.jeu.joueurs.length == 4) {
            this.jeu.start();
            this.jeu = new Jeu();
            JeuDb.dropPlayers();
            this.jeux.push(jeu);
        } 

        ws.on('close', () => {
            
            if(!ws.enGame && !ws.jeuFini){
                let j = this.jeu.joueurs.find(joueur=>joueur.ws==ws);
                JeuDb.deleteOne(j.pseudo)
                this.jeu.posLibres.push(j.infosDepart.posDepart)
                this.jeu.broadcast(JSON.stringify({
                    gameStatut: "quitterFile",
                    joueurPseudo : j.pseudo
                }));
                this.jeu.joueurs = this.jeu.joueurs.filter((joueur)=>{
                    return joueur.ws != ws; 
               });
            }
        });
        

    }

}
module.exports = FileAttente;
