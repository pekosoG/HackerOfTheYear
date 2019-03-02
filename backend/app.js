const express = require('express');
const http = require('http');
var bodyParser = require('body-parser');
const socketIO = require('socket.io');

let players={};

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
    console.log('pidieron los players',players.length);
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(players));
})

io.on('connection', socket => {
    console.log('new connection',players)

    socket.on('setAlias',(alias)=>{
        if(players[alias]==undefined){
            players[alias]={alias:alias,x:0,y:0,alive:true};

            let game={'map':[],'me':players[alias]};
            socket.emit('gameStart',game);
            console.log(players);
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

    socket.on('shoot',(shoot)=>{
        players = players.map(dude=>{
            console.log(dude,shoot);
        })
    })
});

server.listen(process.env.port|3000, () => console.log(`Escuchando en el puerto ${process.env.port|3000}`));