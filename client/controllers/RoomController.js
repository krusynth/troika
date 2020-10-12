import dupe from '../lib/dupe.js';
import BaseController from './BaseController.js';
import controllerFactory from '../lib/controllerFactory.js';

export default class RoomController extends BaseController {
  static name = 'room';
  static template = '/partials/room.html';
  static url = '/room/{roomId}';

  drawers = {
    character: false,
    dice: false,
    notes: false,
    combat: false
  };

  messages = [];

  // Angular's internals appear to require an explicit constructor.
  constructor($rootScope, $scope, $http, $state, $document, $sce, SocketService) {
    $rootScope.roomId = $state.params.roomId;
    super($rootScope, $scope, $http, $state, $document, $sce, SocketService);

    this.$scope.content = {
      messages: []
    };

    this.$scope.character = {
      locked: false
    }

    this.$scope.staminaWarning = () => {
      if(this.$scope.gamestate && this.$scope.gamestate.character && this.$scope.gamestate.character.stamina !== null) {
        return (this.$scope.gamestate.character.stamina <= 4)
      }
      else {
        return false;
      }
    }
  }

  init() {
    super.init()
    .then(() => this.joinGame() )
    .then(data => {
      if(data) {
        if(!this.$scope.gamestate.player.name) {
          let name = '';
          while(!name.length) {
            name = prompt('Please enter your name. (You\'ll name your character later!)');
          }

          this.$scope.gamestate.player.name = name;
        }

        this.updateRoom(data);
        this.loadStatus(data);

        // Open drawers that should be active.  On init only!
        if(this.$scope.gamestate.character.name) {
          this.drawers.character = true;
        }
        if(this.$scope.status.type == 'combat') {
          this.drawers.combat = true;
        }

        this.attachListeners();
      }
    });
  }

  attachListeners() {
    /** Socket Events **/
    // Basic Events
    this.socket.listen('playerJoined', data => this.updateRoom(data));
    this.socket.listen('playerUpdated', data => this.updateRoom(data));

    this.socket.listen('roll', data => this.handleRoll(data));

    // Combat
    this.socket.listen('startCombat', data => this.handleStartCombat(data));
    this.socket.listen('nextCombatTurn', data => this.handleNextCombatTurn(data));
    this.socket.listen('nextCombatRound', data => this.handleNextCombatRound(data));
    this.socket.listen('endCombat', data => this.handleEndCombat(data));

    /** Document Events **/
    this.$document.on('click', e => this.clearContextMenus());
  }

  updateRoom(data) {
    this.roomMessage(data);

    this.loadMe(data.room);
    this.loadPlayers(data.room);

    this.$scope.$apply();
  }

  loadMe(room) {
    let me = room.players[this.$scope.gamestate.player.sessionId];

    if(me && me.character) {
      this.$scope.gamestate.loadCharacter(me.character);
    }
  }

  loadPlayers(room) {
    // Compare players as we go.
    let oldPlayers = false;
    if(this.$scope.players) {
      oldPlayers = dupe(this.$scope.players);
    }

    this.$scope.players = {};
    let keys = Object.keys(room.players);
    for(let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let player = dupe(room.players[key]);
      player.show = false;

      // Don't do anything about me.
      if(
        this.$scope.gamestate.character &&
        this.$scope.gamestate.character.name &&
        keys[i] === this.$scope.gamestate.player.sessionId
      ) {
        continue;
      }

      this.$scope.players[key] = player;
    }
  }

  roomMessage(data) {
    let msg;

    switch(data.event) {
      case 'playerJoined':
        if(
          data.player !== this.$scope.gamestate.player.sessionId &&
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
        }
        break;

      case 'playerUpdated':
        if(data.player !== this.$scope.gamestate.player.sessionId) {
          // We only message if there's been a change in name or background.
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
          }
        }
        break;
    }
  }

  handleRoll(data) {
    data['type'] = 'roll';
    data['die'] = `<die-icon value="${data.dice}"></die-icon>`;

    this.$scope.content.messages.unshift(data);
    this.$scope.$apply();
  }

  toggleDrawer(name) {
    this.drawers[name] = !this.drawers[name];
  }

  /* Character Management */
  /* Todo: move to separate controller. */

  clearCharacter() {
    this.$scope.gamestate.newCharacter();
    this.$scope.gamestate.save();
  }

  randomCharacter() {
    this.socket.send('randomCharacter', {}).then(chr => {
      this.$scope.gamestate.loadCharacter(this.processCharacter(chr));
      this.$scope.$apply();
    });
  }

  findCharacter() {
    let search = prompt('Search for a background');
    if(search.length) {
      this.socket.send('findCharacter', {search: search}).then(chr => {
        if(chr) {
          this.$scope.gamestate.loadCharacter(this.processCharacter(chr));
          this.$scope.$apply();
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

  showItemContext(e) {
    e.stopPropagation();
    $('.context-menu').addClass('hide');
    $(e.currentTarget).parent().find('.context-menu').removeClass('hide');
  }

  clearContextMenus(e) {
    // e.stopPropagation();
    $('.context-menu').addClass('hide');
  }

  /* Status & Combat */

  // loadStatus is only called once at room load.
  loadStatus(data) {
    this.$scope.status = data.room.status;

    if(!this.$scope.status) {
      this.$scope.status = {};
    }

    if(!this.$scope.status.enemies) {
      this.$scope.status.enemies = [];
    }

    if(!this.$scope.status.enemies.length) {
      this.$scope.status.enemies.push({
        name: '',
        value: ''
      });
    }

    if(data.room.status && typeof data.room.status.stack !== 'undefined' && typeof data.room.status.turn !== 'undefined') {
      this._handleNextCombatTurn(data);
    }

    this.$scope.$apply();
  }

  startCombat() {
    if(!this._combatHasEnemies()) {
      alert('Please create an enemy before starting combat.');
    }
    else {
      this.$scope.status.type = 'combat';

      this.send('startCombat', this.$scope.status);
    }
  }

  _combatHasEnemies() {
    let hasEnemies = false;
    if(this.$scope.status.enemies) {
      for(let i = 0; i < this.$scope.status.enemies.length; i++) {
        if(this.$scope.status.enemies[i].name && this.$scope.status.enemies[i].value) {
          hasEnemies = true;
          break;
        }
      }
    }
    return hasEnemies;
  }

  nextCombatTurn() {
    if(!this._combatHasEnemies()) {
      alert('Please create an enemy before continuing combat.');
    }
    this.send('nextCombatTurn', this.$scope.status);
  }

  stopCombat() {
    this.send('endCombat');
  }

  clearEnemies() {
    this.$scope.status.enemies = [{
      name: '',
      value: ''
    }];
    // this.$scope.$apply();
  }


  // Listeners
  handleStartCombat(data) {
    this.$scope.status = data.room.status;

    this.$scope.content.messages.unshift({
      type: 'startCombat',
      datetime: data.datetime
    });
    this._handleNextCombatTurn(data);
    this.$scope.$apply();
  }

  handleNextCombatTurn(data) {
    this.$scope.status = data.room.status;

    this._handleNextCombatTurn(data);
    this.$scope.$apply();
  }

  _handleNextCombatTurn(data) {
    let turn = data.room.status.stack[data.room.status.turn];
    this.$scope.status.turn = turn;

    if(turn.type === 'player') {
      turn.player = data.room.players[turn.id];
    }

    this.$scope.content.messages.unshift({
      type: 'combatTurn',
      datetime: data.datetime,
      turn: turn
    });
  }

  handleNextCombatRound(data) {
    this.$scope.status = data.room.status;

    this.$scope.content.messages.unshift({
      type: 'combatRound',
      datetime: data.datetime
    });
    this._handleNextCombatTurn(data);
    this.$scope.$apply();
  }

  handleEndCombat(data) {
    // We want to update the status, but not lose the enemies.
    this.$scope.status.type = '';
    this.$scope.status.turn = null;

    this.$scope.content.messages.unshift({
      type: 'endCombat',
      datetime: data.datetime
    });
    this.$scope.$apply();
  }
}

controllerFactory(RoomController);