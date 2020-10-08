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
    players: DataTypes.JSONB
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

  return Room;
};