// import Player from '../models/Player.js';
import GameState from '../models/GameState.js';

export default class BaseController {
  static name = '';
  static template = '';
  static url = '';

  player = {};
  character = {};

  constructor ($rootScope, $scope, $http, $state, $sce, SocketService) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$http = $http;
    this.$state = $state;
    this.$sce = $sce;
    this.socket = SocketService;
    this.$scope.ready = false;

    $scope.trustAsHtml = $sce.trustAsHtml;

    // this.$scope.ready = false;
    // this.$scope.init = () => { console.log('init'); this.init(); };
    // this.$scope.init();

    this.init();
  }

  init() {
    return this.socket.connect()
    .then(() => {
      this.gamestate = new GameState({
        socket: this.socket,
        gameId: this.$state.params.roomId
      });
console.log('gamestate data sending', this.gamestate.data);
      return this.socket.send('init', this.gamestate.data)
    })
    .then(result => {
      this.gamestate.player.sessionId = result.sessionId;

      this.$scope.ready = true;
      this.$scope.$apply();
    });
  }

  send(name, data) {
    if(!data) { data = {}; }
    let req = Object.assign(data, this.gamestate.data);

    console.log('socket.send', data, req);
    return this.socket.send(name, data);
  }

  createGame() {
    return this.socket.send('newGame', this.gamestate.data).then(room => {
      this.$state.go('room', {room: room.name});
    });
  }

  joinGame() {
    return this.socket.send('joinGame', this.gamestate.data).then(room => {
      console.log('joinGame room', room);
      if(room) {
        if(this.$state.current.name !== 'room') {
          console.log('redirect to room', room.name);
          this.$state.go('room', {roomId: room.name});
        }
      }
      else {
        alert('Room not found, please create a new one.');
        if(this.$state.current.name !== 'lobby') {
          console.log('redirect to lobby');
          this.$state.go('lobby');
        }
      }

      return room;
    });
  }
}
