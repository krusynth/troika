// import Player from '../models/Player.js';
import GameState from '../models/GameState.js';

export default class BaseController {
  static name = '';
  static template = '';
  static url = '';

  player = {};
  character = {};

  constructor ($rootScope, $scope, $http, $state, $document, $sce, SocketService) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$http = $http;
    this.$state = $state;
    this.$document = $document;
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
      this.$scope.gamestate = new GameState({
        socket: this.socket,
        gameId: this.$state.params.roomId
      });
      return this.socket.send('init', this.$scope.gamestate.data)
    })
    .then(result => {
      this.$scope.gamestate.player.sessionId = result.sessionId;

      this.$scope.ready = true;
      this.$scope.$apply();
    });
  }

  send(name, data) {
    if(!data) { data = {}; }
    let req = Object.assign(data, this.$scope.gamestate.data);

    return this.socket.send(name, data);
  }

  createGame() {
    return this.socket.send('newGame', this.$scope.gamestate.data).then(data => {
      this.$state.go('room', {roomId: data.room.name});
    });
  }

  joinGame() {
    return this.socket.send('joinGame', this.$scope.gamestate.data).then(data => {
      let room = data.room;

      if(room) {
        if(this.$state.current.name !== 'room') {
          this.$state.go('room', {roomId: room.name});
        }
      }
      else {
        alert('Room not found, please create a new one.');
        if(this.$state.current.name !== 'lobby') {
          this.$state.go('lobby');
        }
      }

      return data;
    });
  }
}
