const express = require('express');
const http = require('http');
var bodyParser = require('body-parser');
const socketIO = require('socket.io');

let players={};

let map=[
    {x:600,y:0,w:100,h:200},
    {x:0,y:300,w:100,h:100},
    {x:200,y:300,w:500,h:100},
    {x:0,y:600,w:300,h:100},
    {x:400,y:500,w:100,h:500},
    {x:600,y:600,w:400,h:100}
]

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
            players[alias]={alias:alias,x:10,y:20,alive:true};

            let game={'map':map,'me':players[alias]};
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