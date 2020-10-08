import BaseController from './BaseController.js';
import controllerFactory from '../lib/controllerFactory.js';

export default class RoomController extends BaseController {
  static name = 'room';
  static template = '/partials/room.html';
  static url = '/room/{roomId}';

  drawers = {
    character: false,
    dice: false,
    notes: false
  };

  messages = [];

  // Angular's internals appear to require an explicit constructor.
  constructor($rootScope, $scope, $http, $state, $sce, SocketService) {
    $rootScope.roomId = $state.params.roomId;
    super($rootScope, $scope, $http, $state, $sce, SocketService);

    this.$scope.content = {
      messages: []
    };

    this.$scope.character = {
      locked: false
    }

    this.$scope.staminaWarning = () => {
      if(this.gamestate && this.gamestate.character && this.gamestate.character.stamina !== null) {
        return (this.gamestate.character.stamina <= 4)
      }
      else {
        return false;
      }
    }
  }

  save() {
    console.log('RoomController.save', this.gamestate.data);
  }

  init() {
    super.init()
    .then(() => this.joinGame() )
    .then(room => {
      console.log('init room', room);
      if(room) {
        this.updateRoom(room, 'initRoom');

        this.attachListeners();
      }
    });
  }

  attachListeners() {
    this.socket.listen('roll', data => this.handleRoll(data));
    this.socket.listen('playerJoined', data => this.updateRoom(data));
    this.socket.listen('playerUpdated', data => this.updateRoom(data));
  }

  updateRoom(data) {
    console.log('updating room', data);
    this.roomMessage(data);

    this.loadMe(data.room);
    this.loadPlayers(data.room);

    this.$scope.$apply();
  }

  loadMe(room) {
    let me = room.players[this.gamestate.player.sessionId];

    if(me && me.character) {
      this.gamestate.loadCharacter(me.character);

      if(this.gamestate.character.name) {
        this.drawers.character = true;
      }
    }
  }

  loadPlayers(room) {
    // Compare players as we go.
    let oldPlayers = false;
    if(this.$scope.players) {
      oldPlayers = JSON.parse(JSON.stringify(this.$scope.players));
    }

    this.$scope.players = {};
    let keys = Object.keys(room.players);
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let player = JSON.parse(JSON.stringify(room.players[key]));
      player.show = false;
      console.log('loadPlayer', keys[i], player);

      // Don't do anything about me.
      if(
        this.gamestate.character &&
        this.gamestate.character.name &&
        keys[i] === this.gamestate.player.sessionId
      ) {
        continue;
      }

      this.$scope.players[key] = player;
    }
  }

  roomMessage(data) {
    console.log('roomMessage', data);
    let msg;

    switch(data.event) {
      case 'playerJoined':
      console.log('playerJoined', data.player, this.$scope.players[data.player]);
        if(
          data.player !== this.gamestate.player.sessionId &&
          !this.$scope.players[data.player] &&
          data.room.players[data.player].player &&
          data.room.players[data.player].player.name
        ) {
          msg = {
            type: data.event,
            player: data.room.players[data.player],
            datetime: data.datetime
          };
          this.$scope.content.messages.unshift(msg);

          console.log('add message', msg);
        }
        break;

      case 'playerUpdated':
        if(data.player !== this.gamestate.player.sessionId) {
          let oldName = '';
          let oldBg = '';
          if(this.$scope.players[data.player] && this.$scope.players[data.player].character) {
            oldName = this.$scope.players[data.player].character.name;
            oldBg = this.$scope.players[data.player].character.background;
          }

          let newName = '';
          let newBg = '';
          if(data.room.players[data.player].character) {
            newName = data.room.players[data.player].character.name;
            newBg = data.room.players[data.player].character.background;
          }

          if(oldName !== newName || oldBg !== newBg){
            msg = {
              type: data.event,
              old: this.$scope.players[data.player],
              player: data.room.players[data.player],
              datetime: data.datetime
            };
            this.$scope.content.messages.unshift(msg);

            console.log('add message', msg);
          }
        }
        break;
    }
  }

  handleRoll(data) {
    console.log('got roll', data);
    data['type'] = 'roll';
    data['die'] = `<die-icon value="${data.dice}"></die-icon>`;

    this.$scope.content.messages.unshift(data);
    console.log('messages', this.$scope.content.messages);
    this.$scope.$apply();
  }

  toggleDrawer(name) {
    this.drawers[name] = !this.drawers[name];
  }

  /* Character Management */
  /* Todo: move to separate controller. */

  clearCharacter() {
    this.gamestate.newCharacter();
    this.gamestate.save();
  }

  randomCharacter() {
    this.socket.send('randomCharacter', {}).then(chr => {
      console.log('random chr', chr);
      this.gamestate.loadCharacter(this.processCharacter(chr));
      this.$scope.$apply();

      console.log('random chr processed', this.gamestate.character.data);
    });
  }

  findCharacter() {
    let search = prompt('Search for a background');
    if(search.length) {
      this.socket.send('findCharacter', {search: search}).then(chr => {
        if(chr) {
          console.log('found chr', chr);

          this.gamestate.loadCharacter(this.processCharacter(chr));
          this.$scope.$apply();

          console.log('find chr processed', this.gamestate.character.data);
        }
        else {
          alert('Background not found, please try a more specific term.');
        }
      });
    }
  }

  processCharacter(chr) {
    chr.skill = chr.attributes.skill;
    chr.stamina = chr.staminaMax = chr.attributes.stamina;
    chr.luck = chr.luckMax = chr.attributes.luck;
    delete chr.attributes;

    for(let i = 0; i < chr.skills.length; i++) {
      chr.skills[i].used = false;
    }

    return chr;
  }
}

controllerFactory(RoomController);