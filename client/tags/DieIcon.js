customElements.define('die-icon', class GameEvent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.show();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChanged', name, oldValue, newValue);
    this.show();
  }

  clear() {
    while (this.firstChild) {
      this.removeChild(this.lastChild);
    }
  }

  show() {
    this.clear();

    let value = this.getAttribute('value');

    let die;

    switch(value) {
      case '1d6':
        die = document.createElement('span');
        die.className = 'fas fa-dice-six dice-icon';
        this.appendChild(die);
        break;

      case '2d6':
        die = document.createElement('span');
        die.className = 'fas fa-dice-six dice-icon';
        this.appendChild(die);

        die = document.createElement('span');
        die.className = 'fas fa-dice-six dice-icon';
        this.appendChild(die);
        break;

      case 'd66':
        die = document.createElement('span');
        die.className = 'fas fa-dice-six dice-icon divided';
        this.appendChild(die);

        die = document.createElement('span');
        die.className = 'fas fa-dice-six dice-icon divided';
        this.appendChild(die);
        break;

      case '1d3':
        die = document.createElement('span');
        die.className = 'fas fa-dice-three dice-icon divided';
        this.appendChild(die);
        break;

      default:
        let val = value.match(/^([0-9]*)d([0-9]+)/);

        if(val !== null) {

          let count = Number(val[1]) || 1;
          let type = val[2];

          for(let i = 0; i < count; i++) {
            let container = document.createElement('span');
            container.className = 'stacked fa-fw dice-icon';

            let bg = document.createElement('span');
            bg.className = 'fas fa-hexagon';
            container.appendChild(bg);

            let text = document.createElement('span');
            text.className = 'fa-layers-text fa-inverse';
            text.appendChild(document.createTextNode(val[2]));
            container.appendChild(text);

            this.appendChild(container);
          }
        }
        break;
    }
  }
});