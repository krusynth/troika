'use strict';

class Dice {
  static roll(val) {
    let vals = val.split('d');
    let type, count;
    let total = 0;
    if(vals.length == 1) {
      count = 1;
      type = parseInt(vals[0]);
    }
    else if(vals.length == 2) {
      count = parseInt(vals[0]);
      type = parseInt(vals[1]);
    }
    else {
      return false;
    }

    // d66 is special.
    if(type === 66) {
      total = Dice.roll('1d6')
      total += (10 * Dice.roll('1d6'));
    }
    else {
      for(let i = 0; i < count; i++) {
        total += Math.ceil(Math.random() * type);
      }
    }

    return total;
  }

  static replace(value) {
    if(Array.isArray(value)) {
      for(let i = 0; i < value.length; i++) {
        value[i] = Dice.replace(value[i]);
      }
      return value;
    }
    else if(typeof value === 'object') {
      let keys = Object.keys(value);
      for(let i = 0; i < keys.length; i++) {
        value[keys[i]] = Dice.replace(value[keys[i]]);
      }
      return value;
    }
    else {
      if(value && value.replace) {
        return value.replace(/([0-9]*d[0-9]+)/gi, Dice.roll);
      }
      else {
        console.log('unknown value', value);
      }
    }
  }
}

module.exports = Dice;