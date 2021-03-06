const uuid4 = require('uuid4');
const { Background, Room } = require('../models');
const Dice = require('../lib/Dice.js');
require('../lib/arrayRandomize.js');

class GameEngine {
  gameData = {};
  players = {};

  constructor() {

  }

  init(io, socket) {
    this.io = io;
    this.socket = socket;

    this.registerHandlers();

    // Create a new session for this player.
    this.socket.emit('connected', {
      datetime: new Date()
    });
    console.log('connected');
  }

  registerHandlers() {
    /* Basic events */
    this.socket.on('init', this.playerInit.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));
    /* Game events */
    this.socket.on('newGame', this.hostCreateNewGame.bind(this));
    this.socket.on('joinGame', this.playerJoinGame.bind(this));
    this.socket.on('updatePlayer', this.updatePlayer.bind(this));
    /* Query our backgrounds */
    this.socket.on('randomCharacter', this.randomCharacter.bind(this));
    this.socket.on('findCharacter', this.findCharacter.bind(this));
    /* Roll some dice */
    this.socket.on('roll', this.roll.bind(this));

    this.socket.on('startCombat', this.startCombat.bind(this));
    // this.socket.on('updateCombat', this.updateCombat.bind(this));
    this.socket.on('nextCombatTurn', this.nextCombatTurn.bind(this));
    this.socket.on('endCombat', this.endCombat.bind(this));
  }

  playerInit(data, callback) {
    console.log('playerInit', data);
    if(!data.player) {
      data = {};
    }

    if(!data.player.sessionId) {
      data.player.sessionId = uuid4();
    }
    this.socket.sessionId = data.player.sessionId;
    callback({sessionId: data.player.sessionId});
  }

  disconnect() {
    console.log('DISCONNECT : session', this.socket.sessionId);
  }

  _ns(id) {
    return `/@${id}`
  }

  hostCreateNewGame(data, callback) {
    console.log('hostCreateNewGame data', data);
    // Create a unique Socket.IO Room

    Room.createRoom().then(room => {
      data.gameId = room.name;

      // this.io.of(this._ns(data.gameId));
      console.log('hostCreateNewGame', room.name, data);
      this.playerJoinGame(data, callback);
    });
  };

  playerJoinGame(data, callback) {
    if(data && data.gameId) {
      console.log('playerJoinGame', data, data.gameId);
      Room.findOne({where: {name: data.gameId}}).then(room => {
        if(!room) {
          console.log(`couldn\'t join game ${data.gameId}`);
          // This is an error.
          callback(false);
          return;
        }

        console.log(`Room found ${room.name}`);

        this.socket.join(this._ns(room.name));

        if(!room.players || !room.players[data.player.sessionId]) {
          console.log('room.setPlayer');
          room.setPlayer(data);
        }

        callback({
          room: room,
          datetime: new Date()
        });

        this.io.to(this._ns(room.name)).emit('playerJoined', {
          room: room,
          player: data.player.sessionId,
          datetime: new Date()
        });
      })
      .catch(error => {
        callback(false);
      });
    }
    else {
      console.log('playerJoinGame failed, no gameId', data);
      callback(false);
    }
  }

  getPlayer(data, callback) {
    console.log('getPlayer')
    if(data.game.gameId && data.player.sessionId) {
      Room.findOne({where: {name: data.gameId}}).then(room => {
        if(room && room.players) {
          console.log('found player', room.players[data.sessionId]);
          callback(room.players[data.sessionId]);
        }
        else {
          callback(false);
        }
      });
    }
    else {
      callback(false);
    }
  }

  updatePlayer(data, callback) {
    console.log('updatePlayer', data, data.gameId, data.player.sessionId);

    if(data.gameId && data.player.sessionId) {

      this._updatePlayer(data).then(room => {
        console.log('player Updated', room.players)
        if(callback) {
          callback(room);
        }

        if(room) {
          this.io.to(this._ns(room.name)).emit('playerUpdated', {
            room: room,
            player: data.player.sessionId,
            datetime: new Date()
          });
        }
      });
    }
    else {
      callback(false);
    }
  }

  _updatePlayer(data) {
    return Room.findOne({where: {name: data.gameId}}).then(async (room) => {
      if(!room) {
        return false
      }

      console.log('data', room);

console.log('_updatePlayer', data);
      let result = await room.setPlayer(data.player.sessionId, data)
console.log('room setPlayer result', result);

      return room;
    });
  }

  randomCharacter(data, callback) {
    data.sessionId = this.socket.sessionId;
    Background.randBg()
    .then(callback);
  }

  findCharacter(data, callback) {
    data.sessionId = this.socket.sessionId;
    Background.findBg(data.search)
    .then(callback);
  }

  /* Roll Dice */
  roll(data, callback) {
    console.log('roll', data);
    let result = Dice.roll(data.dice);

    callback(result);

    this.io.to(this._ns(data.gameId)).emit('roll', {
      player: data.player,
      character: data.character,
      dice: data.dice,
      result: result,
      type: data.type,
      datetime: new Date()
    });
  }

  /* Handle Combat */
  startCombat(data, callback) {
    return Room.findOne({where: {name: data.gameId}}).then(async (room) => {
      if(!room) {
        callback(false);
        return false
      }

      await room.combatNewRound(data);

      this.io.to(this._ns(room.name)).emit('startCombat', {
        room: room,
        datetime: new Date()
      });

      console.log('startCombat', room.status);
    });
  }

  // updateCombat(data, callback) {
  //   return Room.findOne({where: {name: data.gameId}}).then(async (room) => {
  //     if(!room) {
  //       callback(false);
  //       return false
  //     }
  //   });
  // }

  nextCombatTurn(data, callback) {
    return Room.findOne({where: {name: data.gameId}}).then(async (room) => {
      if(!room) {
        callback(false);
        return false
      }

      let turn = room.status.turn+1;

      // If the next turn is valid and not the end of the round.
      if(room.status.stack && room.status.stack[turn] && room.status.stack[turn].type !== 'end') {
        await room.combatNextTurn(data);

        this.io.to(this._ns(room.name)).emit('nextCombatTurn', {
          room: room,
          datetime: new Date()
        });
      }
      // Otherwise we need to start a new round.
      else {
        await room.combatNewRound(data);

        this.io.to(this._ns(room.name)).emit('nextCombatRound', {
          room: room,
          datetime: new Date()
        });
      }

      console.log('nextCombatTurn', room.status);
    });
  }

  endCombat(data, callback) {
    return Room.findOne({where: {name: data.gameId}}).then(async (room) => {
      if(!room) {
        callback(false);
        return false;
      }

      await room.combatEnd();

      this.io.to(this._ns(room.name)).emit('endCombat', {
        room: room,
        datetime: new Date()
      });

      console.log('endCombat', room.status);
    });
  }


}

module.exports = GameEngine;