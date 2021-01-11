const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/tron', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
const User = db.collection("users");
const Player = require("../../models/player");
const Users =  require("../../models/user");

class JeuDb {



    static find(joueur) {
        return User.findOne({
            pseudo: joueur.pseudo
        })
    }

    static finPartie(joueur, gagnant) {

        User.findOne({
            pseudo: joueur.pseudo
        }, function (err, user) {
            if (joueur.pseudo == gagnant) {
                User.updateOne({
                    pseudo: joueur.pseudo
                }, {
                    $set: {
                        nb_win: user.nb_win + 1
                    }
                }, function (err, obj) {
                    if (err) {
                        console.log("err", err);
                    } else {
                        console.log(" Pseudo gagné: Mise à Jour ");
                    }
                });
            } else {
                User.updateOne({
                    pseudo: joueur.pseudo
                }, {
                    $set: {
                        nb_lost: user.nb_lost + 1
                    }
                }, function (err, obj) {
                    if (err) {
                        console.log("err", err);
                    } else {
                        console.log(" Pseudo perdu: Mise à Jour ");
                    }
                });
            }
        });
    }

    static dropPlayers() {
        db.collections['players'].drop(function (err) {
            console.log('collection dropped');
        });
    }

    static deleteOne(pseudo) {


        Player.deleteOne({
            pseudo : pseudo
        }, function (err) {
            if (err) console.log(err);
            console.log("joueur "+pseudo +" est sortit de la file d'attente");
        })

    }

    static getTopThree(){
        return Users.find()
        .sort("-nb_win")
        .limit(3);
        
    }

    static getMotosCouleur(){
       return  Player.find({}).select('moto_color -_id');
    }


}




module.exports = JeuDb;