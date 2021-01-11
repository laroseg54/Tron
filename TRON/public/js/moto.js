class Moto {

    constructor(pseudo, couleur, grille,direction, x, y,stats) {

        this.pseudo = pseudo;
        this.couleur = couleur;
        this.grille = grille;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.etat = "vivant";
        this.stats = stats;
  
       
        
        let newMoto = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        if (couleur=="white"){
            newMoto.setAttribute('href',"../img/motoBlanche.svg")
        }
        if (couleur=="green"){
            newMoto.setAttribute('href',"../img/motoVerte.svg")
        }
        if (couleur=="blue"){
            newMoto.setAttribute('href',"../img/motoBleu.svg")
        }
        if (couleur=="yellow"){
            newMoto.setAttribute('href',"../img/motoJaune.svg")
        }
        newMoto.setAttribute('id', pseudo);
        newMoto.setAttribute('class','motoC');
        newMoto.setAttribute('width', "2");
        newMoto.setAttribute('height', "2");
        newMoto.setAttribute('x', this.x);
        newMoto.setAttribute('y', this.y);
        this.motoGraphique = newMoto; 
        grille.appendChild(newMoto);
    }


    setDirection(directions){
       let dir = directions.get(this.pseudo);
       if(dir=="rien"){
           this.etat="mort";
       }
        
        this.direction = dir;
    
    }

     addWall(w, h, dx, dy) {
        
         if(this.wall && this.direction==this.ancienneDirection ){
             if(this.direction=="droite"||this.direction=="gauche"){
                let oldWitdh = parseFloat(this.wall.getAttribute('width'));
                this.wall.setAttribute('width',oldWitdh+parseFloat(w));
                if(this.direction=="gauche"){
                    this.wall.setAttribute('x', this.x + dx);
                    this.wall.setAttribute('y', this.y + dy);
                }
             }
             else{
                let oldHeight = parseFloat(this.wall.getAttribute('height'));
                this.wall.setAttribute('height',oldHeight+parseFloat(h)); 
                if(this.direction=="haut"){
                    this.wall.setAttribute('x', this.x + dx);
                    this.wall.setAttribute('y', this.y + dy);
                }
             }
            
         }
         else{
            this.ancienneDirection = this.direction;
            let positionX = this.x;
            let positionY = this.y;
            let newWall = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            newWall.setAttribute('class', 'uWall')
            newWall.setAttribute('fill', this.couleur);
            newWall.setAttribute('width', w);
            newWall.setAttribute('height', h);
            newWall.setAttribute('x', positionX + dx);
            newWall.setAttribute('y', positionY + dy);
            grille.appendChild(newWall);
            this.wall = newWall;
           

         }
       
    }


}



