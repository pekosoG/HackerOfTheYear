const express = require('express');
const http = require('http');
var bodyParser = require('body-parser');
const socketIO = require('socket.io');

let players={};
let playersSockets={};
let alive=0;

let max_size=1000;
let map=[
    {x:600,y:0,w:100,h:200},
    {x:0,y:300,w:100,h:100},
    {x:200,y:300,w:500,h:100},
    {x:0,y:600,w:300,h:100},
    {x:400,y:500,w:100,h:500},
    {x:600,y:600,w:400,h:100}
]

const generateRandomMap = () =>{
    walls=Math.floor((Math.random() * 10) + 2)
    var tmpMap=[];
    for(i=0;i<walls;i++){
        let x=Math.floor((Math.random() * max_size) + 0)+150;
        let y=Math.floor((Math.random() * max_size) + 0);

        let w=Math.floor((Math.random() * (max_size-100)) + 0);
        let h=100;
        tmpMap.push({x,y,w,h});
    }
    return tmpMap;
}

const sendStartGame = (alias,socket = false) =>{
    let game={'map':map,'me':players[alias]};
    if(!socket)
        socket = playersSockets[alias].socket;
    socket.emit('gameStart',game);
    alive++;
    console.log(alive);
}

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIO(server);


app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/players',function(req,res){
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(players));
})

io.on('connection', socket => {
    console.log('new connection',players)

    socket.on('setAlias',(alias)=>{
        console.log('set Alias',alias);
        if(players[alias]==undefined){

            players[alias]={alias:alias,x:10,y:20,alive:true,points:0};
            playersSockets[alias]={socket:socket};
            sendStartGame(alias);
        }
    });

    socket.on('move',(coord)=>{
        console.log('coord',coord);
        tmp = players[coord.alias]
        console.log(tmp);
        if(tmp!= undefined){
            players[coord.alias] = { 
                x: coord.x,
                y: coord.y,
                alias: coord.alias,
                alive: true
            };
        }
    })

    socket.on('dead',(alias)=>{
        if(players[alias]!=undefined){
            tmp=players[alias];
            if(tmp.alive){
                console.log('alive',alive,'alias',alias);
                players[alias]={alias:alias,x:10,y:20,alive:false};
                alive--;
            }
        }
        if(alive<1){
            alive=0;
            console.log('everyone is dead');
            map=generateRandomMap();
            console.log('new map');
            Object.keys(players).forEach(function(key) {
                console.log('Key : ' + key );
                players[alias]={alias:alias,x:10,y:20,alive:true,points:0};
                sendStartGame(key)
            });
        }
    })
});

server.listen(process.env.port|3000, () => console.log(`Escuchando en el puerto ${process.env.port|3000}`));