
class Joueur {

    constructor(ws,pseudo,couleur){

        this.ws = ws;
        this.pseudo =  pseudo;
        this.couleur = couleur;
        this.etat = "vivant";
        this.direction = "droite";
        ws.on('message', message => {
            let data = JSON.parse(message);
            if(data.statut=="enJeu"){
                
                if(data.etat =="vivant") {
                    this.direction = data.direction;
                }
                else{
                    this.direction = "rien";
                    this.etat = "mort";
                }
                
            }
           
        });
        ws.on('close', () => {
            this.etat="mort";
            this.direction = "rien";
        });
    }

    setInfosDepart(infos){
        this.infosDepart = infos;
        this.direction = infos.posDepart.dir;
    }


}

module.exports = Joueur;