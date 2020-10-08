'use strict';

const {
  Model,
  Op
} = require('sequelize');

const Dice = require('../lib/Dice.js');
const baseCharacter = require('../data/baseCharacter.json');

module.exports = (sequelize, DataTypes) => {
  class Background extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Background.init({
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    info: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Background',
    tableName: 'backgrounds'
  });

  Background.randBg = function() {
   return this.findOne({
      order: sequelize.random()
    }).then(result => result.details());
  }

  /**
   * Search by key first, and then look for a name match.
   */
  Background.findBg = function(search) {
    if(search && search.length >= 2) {
      console.log('search', search);
      return this.findOne({
        where: {
          key: search
        }
      })
      .then( result => {
        if(result) {
          console.log('found by key', result.details());
          return result.details();
        }
        else {
          return this.findAndCountAll({
            where: {
              name: {
                [Op.iLike]: `%${search}%`
              }
            }
          }).then( result => {
            if(result && result.count === 1) {
              return result.rows[0].details();
            }
            // If we have a list of results, just give the key and name.
            else {
              // TODO: FIX ME
              return false;
              // return result.map(elm => {
              //   return {elm.key: elm.name}
              // });
            }
          });
        }
      })
      .catch( err => {
        console.log('Error!', err);
        return false;
      });
    }
    else {
      return Promise.reject();
    }
  }

  Background.prototype.details = function() {
    let character = JSON.parse(JSON.stringify(baseCharacter));

    for(let key in character.attributes) {
      character.attributes[key] = eval(Dice.replace(character.attributes[key]));
    }

    character.background = this.name;
    character.key = this.key;
    character.skills = [];
    for(let i = 0; i < this.info.skills.length; i++) {
      character.skills.push({
        name: Object.keys(this.info.skills[i])[0],
        value: Object.values(this.info.skills[i])[0]
      });
    }

    character.armor = Dice.replace(this.info.armor);
    character.weapons = Dice.replace(this.info.weapons);
    if(this.info.inventory === 'none') {
      character.inventory = [];
    }
    else {
      if(this.info.inventory) {
        character.inventory = this.info.inventory.concat(character.inventory);
      }
      character.inventory = Dice.replace(character.inventory);
    }
    character.special = this.info.special;

    return character;
  }

  return Background;
};