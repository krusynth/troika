import Model from './Model.js'

export default class Player extends Model {
  init() {
    let values = [];
    const keys = Object.keys(localStorage);
    let i = keys.length;

    while (i--) {
      this._data[keys[i]] = localStorage.getItem(keys[i]);
    }
  }

  update(name, value) {
    super.update(name, value);
    localStorage.setItem(name, value);
  }
}

