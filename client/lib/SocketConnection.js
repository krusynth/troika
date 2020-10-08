import gameClient from './GameClient.js';

export class SocketConnection {
  socket = null;
  listeners = {};

  constructor() {
    console.log('SocketConnection.constructor');
  }

  connect() {
    console.log('init: this.socket', this.socket);
    if(!this.socket) {
      console.log('connecting');
      this.socket = io.connect(`//${window.location.hostname}`);

      return new Promise((resolve, reject) => {
        this.listen('connect', resolve);
      });
    }
    else {
      console.log('socket already connected');
      return Promise.resolve();
    }
  }

  send(name, data) {
    console.log('SocketConnection.emit', name, data);
    return new Promise((resolve, reject) => {
      this.socket.emit(name, data, result => {
        console.log('sent', name, data, result);
        resolve(result)
      })
    });
  }

  listen(name, callback) {
    console.log('SocketConnection.bind', name);

    if(!this.listeners[name]) {
      this.listeners[name] = [];
      this.socket.on(name, result => { console.log('resolved', name, result); this._call(name, result); });
    }

    this.listeners[name].push(callback);
    console.log('listen', name, this.listeners[name]);
  }

  _call(name, result) {
    if(this.listeners[name] && this.listeners[name].length) {
      for(let i = 0; i < this.listeners[name].length; i++) {
        console.log('socket._call', name, i, result);
        if(result) {
          result.event = name;
        }
        this.listeners[name][i](result);
      }
    };
  }
}

gameClient.factory('SocketService', () => {
  let socket = new SocketConnection();
  console.log('SocketService', socket);
  return socket;
});
