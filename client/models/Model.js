export default class Model {
  _data = {};

  constructor(args) {
    this.init(args);

    let root = this;

    // Custom wrapper for properties of the Model. Workaround for update() not
    // being called on nested objects and arrays.
    const nested = {
      set: (target, name, value) => {
        // console.log('set proxy', name);
        target[name] = value;
        this.update();
        return true;
      },
      get: (target, name) => {
        if(target[name] === null) {
          return null;
        }
        if(Array.isArray(target[name])) {
          return new Proxy(target[name], nested);
        }

        // This doesn't work with angular, it causes some sort of infinite loop
        // When there are objects under arrays.
        // else if(typeof(target[name]) === 'object') {
        //   console.log('proxy proxy object', name);
        //   return new Proxy(target[name], nested);
        // }

        return target[name];
      }
    };

    return new Proxy(this, {
      set: (target, name, value) => {
        return this._set(name, value);
      },
      get: (target, name) => {
        if(target._get(name) === 'null') {
          return null;
        }

        // console.log('get', name, typeof target[name]);
        if(Array.isArray(target._get(name))) {
          // console.log('Proxy.proxy', name);
          return new Proxy(target._get(name), nested);
        }

        if(target.hasOwnProperty(name)) {
          // console.log('Proxy.hasOwnProperty', name);
          return target[name];
        }

        if(name === 'data') {
          // console.log('Proxy.data', target._data);
          return target.data();
        }

        if(typeof target[name] === 'function') {
          // console.log('Proxy.function', name);
          return function() {
            let result = target[name].apply(this, arguments);
            // console.log('Proxy.function apply', name, result);
            return result;
          }
        }

        // if(typeof target[name] === 'object') {
        //   console.log('Proxy.object', name);
        // }

        return target._get(name);
      },
      apply: (target, fn, args) => {
        // console.log('Proxy.apply', fn, args);
        return target.apply(fn, args);
      }
    });
  }

  init(args) {}

  load(data) {
    // console.log('load', data);

    this._data = data;
  }

  _set(name, value) {
    // console.log('set', name, value);

    if(name === 'data' || name === '_data') {
      return this._data = value;
    }

    this._data[name] = value;
    this.update(name, value);
    return value;
  }

  _get(name) {
    if(name === 'data') {
      return this._data;
    }

    return this._data[name];
  }

  update(name, value) {}

  data() {
    return JSON.parse(JSON.stringify(this._data));
  }
}