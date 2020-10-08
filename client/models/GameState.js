import Model from './Model.js';
import Player from './Player.js';
import Character from './Character.js';

export default class GameState {
  constructor(args) {
    this.init(args);
  }

  init(args) {
    this.socket = args['socket'];
    this.player = args['player'] || new Player();
    this.character = args['character'] || new Character({parent: this});
    this.gameId = args['gameId'] || null;
  }

  get data() {
    let data = {
      gameId: this.gameId,
      player: JSON.parse(JSON.stringify(this.player.data)),
      character: JSON.parse(JSON.stringify(this.character.data))
    };

    // Remove blanks.
    if(data.character) {
      data.character.inventory = data.character.inventory.filter(elm => elm);
      data.character.weapons = data.character.weapons.filter(elm => elm);
      data.character.armor = data.character.armor.filter(elm => elm);
      data.character.skills = data.character.skills.filter(elm => !!elm.name ? elm : false);
    }

    return data;
  }

  save() {
    console.log('saving Player', this.data);
    return this.socket.send('updatePlayer', this.data);
  }

  newCharacter() {
    this.character = new Character({parent: this});
  }

  loadCharacter(data) {
    console.log('character.load', this.character.load);
    this.character.load(data);
  }

  // newGame() {
  //   return this.socket.send('joinGame', this.gamestate.data).then(room => {
  //     if(room) {
  //       this.gameId = room.name;
  //     }
  //     return room;
  //   });
  // }

  // joinGame(gameId) {
  //   if(gameId) {
  //     this.gameId = gameId;
  //   }
  //   return this.socket.send('joinGame', this.gamestate.data).then(room => {
  //     if(!room) {
  //       this.gameId = null;
  //     }
  //     return room;
  //   });
  // }
}

