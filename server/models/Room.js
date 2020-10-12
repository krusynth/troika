const roomName = require('../data/roomName.json');

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  Room.init({
    name: DataTypes.STRING,
    players: DataTypes.JSONB,
    status: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'rooms'
  });

  Room.createRoom = async function() {
    // Make sure we generate a unique name.
    let result, name;
    do {
      name = this.generateName();
      result = await this.findOne({where: {name: name}});
    } while(result);

    return await Room.create({name: name});
  }

  Room.generateName = function() {
    function random(arr) {
      return arr[Math.floor(Math.random()*arr.length)];
    }

    let modifier  = random(roomName.modifier);
    let adjective = random(roomName.adjective);
    let noun      = random(roomName.noun);

    return `${modifier}-${adjective}-${noun}`;
  }

  // Add or update player.
  Room.prototype.setPlayer = function(sessionId, data) {
    if(!this.players) {
      this.players = {};
    }
console.log('Room.setPlayer', data);
    let updateData = {};
    updateData[`players.${sessionId}`] = data;

    this.set(updateData);

console.log('players', this.players);
    return this.save();
  }

  Room.prototype.combatNewRound = function(data) {
    let round = 1;
    if(this.status && this.status.round) {
      round = this.status.round++;
    }

    let status = {
      'type': 'combat',
      'stack': [{'type': 'end'}], // One token to start, the end of round.
      'enemies': data.enemies,
      'initiative': null,
      'turn': 0,
      'round': round
    };

    let players = Object.keys(this.players);
    for(let i = 0; i < players.length; i++) {
      let player = this.players[players[i]];
      if(player.character && player.character.name && player.character.background) {
        // Players have an initiative value of 2, so we add them to the stack twice.
        status.stack.push({
          'type': 'player',
          'id': players[i]
        });
        status.stack.push({
          'type': 'player',
          'id': players[i]
        });
      }
    }

    if(data.enemies) {
      for(let i = 0; i < data.enemies.length; i++) {
        if(data.enemies[i].name && data.enemies[i].value) {
          for(let j = 0; j < Number(data.enemies[i].value); j++) {
            status.stack.push({
              'type': 'enemy',
              'name': data.enemies[i].name
            });
          }
        }
      }
    }

    status.stack = status.stack.randomize();
    // Make sure we don't begin with the end.
    while(status.stack[0].type == 'end') {
      status.stack = status.stack.randomize();
    }

    this.status = status;

    return this.save();
  }

  Room.prototype.combatNextTurn = function(data) {
    this.set({'status.turn': this.status.turn + 1});
    return this.save();
  }

  Room.prototype.combatEnd = function() {
    this.status = {};
    return this.save();
  }

  return Room;
};