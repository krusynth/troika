const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const path = require('path');
const config = require('./config.js');

const GameEngine = require('./lib/GameEngine');

server.listen(config.app.port);

const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));
app.use(config.session.handler);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
})

const game = new GameEngine();

io.sockets.on('connection', function (socket) {
    //console.log('client connected');
    game.init(io, socket);
});
