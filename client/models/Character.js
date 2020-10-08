import Model from './Model.js'

export default class Character extends Model {
  _data = {
    notes: '',
    name: '',
    background: '',
    special: '',
    skill: '',
    stamina: '',
    staminaMax: '',
    luck: '',
    luckMax: '',
    skills: [
      {name: '', value: '', used: false},
      {name: '', value: '', used: false},
      {name: '', value: '', used: false},
      {name: '', value: '', used: false},
      {name: '', value: '', used: false},
      {name: '', value: '', used: false}
    ],
    // skillsName: ['', '', '', '', '', ''],
    // skillsValue: ['', '', '', '', '', ''],
    // skillsUsed: [false, false, false, false, false, false],
    inventory: ['', '', '', '', '', ''],
    weapons: ['', '', ''],
    armor: ['', '', '']
  };

  init(args) {
    this.parent = args.parent;
    console.log('Character.init', args.data);
    if(args.data) {
      this._data = args.data;
    }

    console.log('new character init _data', this._data);
  }

  data() {
    let data = super.data();
    // data.skills = [];
    // for(let i = 0; i < this._data.skillsName.length; i++) {
    //   if(this._data.skillsName[i]) {
    //     data.skills.push({
    //       name: this._data.skillsName[i],
    //       value: this._data.skillsValue[i],
    //       used: this._data.skillsUsed[i]
    //     });
    //   }
    // }

    // delete data.skillsName;
    // delete data.skillsValue;
    // delete data.skillsUsed;

    return data;
  }

  update(name, value) {
    // console.log('updating character', this.parent.data);
    this.parent.save();
  }

  skillValue(idx) {
    if(this.skill && this.skills[idx] && this.skills[idx].value) {
      return Number(this.skill) + Number(this.skills[idx].value);
    }
    return '';
  }
}