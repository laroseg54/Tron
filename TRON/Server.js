const WebSocket = require('ws');
const bodyParser = require('body-parser');
const FileAttente = require("./local_modules/jeu/fileAttente.js");
const User = require("./models/user");
const Player = require("./models/player");
const path = require('path');
const express = require('express');
const cors = require('cors'); 
const cookieSession = require('cookie-session');
const JeuDb = require("./local_modules/jeu/jeuDB.js");


//MongoDB
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://toto:toto@cluster0.4n6w4.mongodb.net/tron?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on('error', error => {
  console.log(error);
});

db.once('open', () => {
  console.log('Database Connection works !');
});
//Fin MongoDB
const app = express();
const server = require('http').createServer();
const wss = new WebSocket.Server({
  server
});
server.on('request', app);
const fileAttente = new FileAttente();
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 
}))
app.use(express.static("public"));
app.use(cors());
app.use(express.json({
  type: ['application/json', 'text/plain']
}))
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());

app.get('/login',function(req,res){
    let adresse = server.address().address;
    if(adresse=="::"){
      adresse="127.0.0.1";
    }
    let platform = req.query.platform?req.query.platform:"ordinateur";
    req.session.platform = platform;
    let motosCouleurs = [];
    JeuDb.getMotosCouleur().then((motos)=>{
      motos.forEach(moto=>{
        motosCouleurs.push(moto.moto_color);
      })
    
      res.render('pages/index.ejs',{adresse: adresse,motosCouleurs:motosCouleurs});
    })
    
});

app.get('/jeu',function(req,res){
  let best3=[];
   JeuDb.getTopThree().then((users)=>{
    users.forEach(user=>{
      best3.push({pseudo:user.pseudo,nb_win:user.nb_win,nb_lost:user.nb_lost});
    
    });
   
    res.render('pages/partie.ejs', {hostname : req.hostname,platform:req.session.platform,best3});
    
   })
    

  //console.log(best3);
  
});

app.post('/login', function (req, res) {
  var pseudo = req.body.pseudo;
  var password = req.body.password;
  var moto_color = req.body.moto_color;
  User.findOne({pseudo: pseudo, password: password}, function(err, obj){
    if(err){
      console.log(err);
    }
    else{
      if (obj != null){
        let player = new Player ({
          pseudo:pseudo,
          password:password,
          moto_color: moto_color,
          score: 0,
        })
        player.save(function (err) {
          if (err){
            console.log(err);
          }
          else {
            console.log('New Player!');
            //res.status(200).send({ pseudo: pseudo })
            // res.writeHead(200, { 'Content-Type': 'application/json' }); 
            res.end(JSON.stringify({pseudo: pseudo}));
          }
        });
      } else {
        res.status(400).send('user not exist! please register!');
        console.log('user not exist! please register!' );
      }
    }
  });
  //res.sendFile(path.join(__dirname, 'public', 'partie.html'));
  //res.redirect('back')
  // la tu met le code pour envoyer à la bdd 
  //res.status(200).send({ pseudo: pseudo })
  //res.writeHead(200, { 'Content-Type': 'application/json' }); 
});



app.post('/register', function (req, res) {
  var newPseudo = req.body.newPseudo;
  var password = req.body.password;
  // la tu met le code pour envoyer à la bdd 
  
  User.findOne({pseudo: newPseudo}, function(err, obj){
    if (obj == null){
      let user = new User ({
        pseudo:newPseudo,
        password:password,
        highestScore: 0,
        nb_win: 0,
        nb_lost: 0
      })
      user.save(function (err) {
        if (err){
          console.log(err);
        }
        else {
          console.log('New User!')
        }
      });
      res.redirect('back')
    } else {
      res.status(400).send('user exist! please change pseudo!');
      console.log('user exist!' + obj);
    }
  });
  
});




wss.on('connection', ws => {
  ws.on('message', message => {
  //  console.log(`Message reçu => ${message}`);
    let data = JSON.parse(message);

    if (data.statut == "initialisation") {
      fileAttente.entrerDansFile(data, ws);
    }
    
    
  });
 
  ws.on("close", function () {
    console.log("Client déconnecté.");
  });

});

server.listen(8080, function () {
  console.log('server success');
});
