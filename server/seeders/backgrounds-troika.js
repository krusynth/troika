'use strict';

let backgrounds =
{
  "11": {
    "background": "Ardent Giant of Corda",
    "skills": [
      {"Strength": 4},
      {"Astrology": 3},
      {"Run": 2},
      {"Climb": 2}
    ],
    "inventory": [
      "Blue Star Map or pocket barometer or Ruby Lorgnette (+2 Second Sight)"
    ],
    "weapons": [],
    "armor": []
  },
  "12": {
    "background": "Befouler of Ponds",
    "skills": [
      {"Spell – Drown": 3},
      {"Swim": 3},
      {"Spell – Tongue Twister ": 2},
      {"Spell – Undo": 2},
      {"Spell – Web": 1},
      {"Sneak": 1},
      {"Second Sight": 1}
    ],
    "inventory": [
    ],
    "weapons": ["large wooden ladle (mace)"],
    "armor": ["stinking sackcloth robes (-1/+1 Sneak)"],
    "special": "You never contract disease as a result of drinking stagnant liquids."
  },
  "13": {
    "background": "Burglar",
    "skills": [
      {"Sneak": 2},
      {"Locks": 2},
      {"Awareness": 1},
      {"Climb": 1},
      {"Trapping": 1},
      {"Knife Fighting": 1},
      {"Crossbow Fighting": 1}
    ],
    "inventory": [
      "lock picks",
      "grappling hooK"
    ],
    "weapons": ["crossbow", "18 bolts"],
    "armor": [],
    "special": "You may Test your Luck to find and get in with the local criminal underbelly if one exists."
  },
  "14": {
    "background": "Cacogen",
    "skills": [
      {"Fusil Fighting": 2},
      {"Astrology": 2},
      {"Second Sight": 2},
      {"Spell – Random": 2},
      {"Spell – Random": 2},
      {"Golden Barge Pilot": 2},
      {"Spell – Random": 1},
      {"Sword Fighting": 1}
    ],
    "inventory": [
    ],
    "weapons": ["fusil", "2d6 plasmic cores", "sword"],
    "armor": ["velare"]
  },
  "15": {
    "background": "Chaos Champion",
    "skills": [
      {"Language – Kurgan": 6},
      {"Maul Fighting": 3},
      {"Secret Signs – Chaos Patron": 3},
      {"Spell – Random": 1},
      {"Second Sight": 1}
    ],
    "inventory": ["dream journal (almost full)"],
    "weapons": ["huge maul"],
    "armor": ["ragged armour (modest)", "ritual scars"],
    "special": "Name your patron. You may call upon your patron for aid once per day. To do so roll three 6s."
  },
  "16": {
    "background": "Claviger",
    "skills": [
      {"Locks": 4},
      {"Strength": 3},
      {"Trapping": 3},
      {"Spell – Open": 2},
      {"Spell – See Through": 1},
      {"Maul Fighting": 1},
      {"Spell – Lock": 1}
    ],
    "inventory": [
      "lock picks"
    ],
    "weapons": ["distinguished sledgehammer (maul)"],
    "armor": ["keys (modest armour)"]
  },
  "21": {
    "background": "Demon Stalker",
    "skills": [
      {"Language – Abyssal": 5},
      {"Spell – Blood Shroud": 3},
      {"Second Sight": 2},
      {"Sword Fighting": 2},
      {"Bow Fighting": 2},
      {"Tracking": 1},
      {"Sneak": 1}
    ],
    "inventory": [
      "pouch of salt",
      "vial of demon blood"
    ],
    "weapons": ["silver sword", "bow", "16 silver arrows"],
    "armor": []
  },
  "22": {
    "background": "Dwarf",
    "skills": [
      {"Awareness": 3},
      {"Sculpting": 2},
      {"Painting": 2},
      {"Metalworking": 2},
      {"Construction": 2},
      {"Strength": 2},
      {"Fist Fighting": 2},
      {"Wrestling": 2},
      {"Hammer Fighting": 1}
    ],
    "inventory": [
      "roll of artist's supplies"
    ],
    "weapons": ["masonry hammer"],
    "armor": [],
    "special": "Dwarfs may eat gems and rare metals as food replacements. Genderless."
  },
  "23": {
    "background": "Epopt",
    "skills": [
      {"Awareness": 2},
      {"Evaluate": 2},
      {"Second Sight": 1},
      {"Etiquette": 1},
      {"Fist Fighting": 1},
      {"Run": 1}
    ],
    "inventory": [
      "collapsible tent"
    ],
    "weapons": ["epopt staff"],
    "armor": ["yellow epopt outfit (modest armour)"],
    "special": "Epopts may Test their Luck to get a yes or no answer to a question about mundane matters."
  },
  "24": {
    "background": "Exotic Warrior",
    "skills": [
      {"Language – Exotic Language": 6},
      {"Fighting in your Weird Weapon": 3},
      {"Language – Local Language": 2},
      {"Spell – Random": 2},
      {"Astrology": 1},
      {"Etiquette": 1}
    ],
    "inventory": [
      "a tea set or 3 pocket gods or astrological equipment"
    ],
    "weapons": ["weird & wonderful weapon"],
    "armor": ["strange clothes", "exciting accent"]
  },
  "25": {
    "background": "Fellow of Knidos",
    "skills": [
      {"Mathmology": 3},
      {"Astrology": 2},
      {"Spell – Find": 2}
    ],
    "inventory": [
      "abacus",
      "lots of scrolls",
      "writing equipment"
    ],
    "weapons": ["large astrolabe (mace)"],
    "armor": []
  },
  "26": {
    "background": "Fellow of the Peerage of Porters & Basin Fillers",
    "skills": [
      {"Strength": 4},
      {"Fist Fighting": 2},
      {"Run": 2},
      {"Hook Fighting": 1},
      {"Sneak": 1},
      {"Awareness": 1}
    ],
    "inventory": [
      "length of rope"
    ],
    "weapons": ["wooden yoke", "bale hook"],
    "armor": ["brown overcoat", "soft doffing cap of the guild"]
  },
  "31": {
    "background": "Gremlin Catcher",
    "skills": [
      {"Tunnel Fighting": 4},
      {"Trapping": 4},
      {"Sneak": 2},
      {"Awareness": 2},
      {"Club Fighting": 2},
      {"Tracking": 2},
      {"Swim": 1}
    ],
    "inventory": [
      "sack",
      "1d6 empty gremlin jars",
      "jar with a pissed–off gremlin",
      "small but vicious dog"
    ],
    "weapons": ["club"],
    "armor": ["flat cap"]
  },
  "32": {
    "background": "Journeyman of the Guild of Sharp Corners",
    "skills": [
      {"Poison": 1},
      {"Sneak": 1},
      {"Locks": 1},
      {"Knife Fighting": 1},
      {"Climb": 1},
      {"Awareness": 1},
      {"Crossbow Fighting": 1},
      {"Swim": 1},
      {"Disguise": 1}
    ],
    "inventory": [
      "3 vials of poison"
    ],
    "weapons": ["curved sword", "garrotte", "crossbow", "6 bolts"],
    "armor": ["black clothes of the apprentice"]
  },
  "33": {
    "background": "Lansquenet",
    "skills": [
      {"Greatsword Fighting": 2},
      {"Pistolet Fighting": 2},
      {"Run": 1},
      {"Fist Fighting": 1},
      {"Astrology": 1}
    ],
    "inventory": [
    ],
    "weapons": ["exquisite pistolet", "greatsword"],
    "armor": ["brightly coloured clothing (modest armour)", "bandolier with 18 plasmic cores"]
  },
  "34": {
    "background": "Lonesome Monarch",
    "skills": [
      {"Etiquette": 3},
      {"Fighting in your Nice Weapon": 3},
      {"Ride": 3},
      {"Tracking": 1}
    ],
    "inventory": [
      "tired horse"
    ],
    "weapons": ["nice weapon of your choice"],
    "armor": ["crown"]
  },
  "35": {
    "background": "Member of Miss Kinsey’s Dining Club",
    "skills": [
      {"Etiquette": 3},
      {"Strength": 1},
      {"Tracking": 1},
      {"Trapping": 1},
      {"Gastrology": 1}
    ],
    "inventory": [
      "embroidered napkin"
    ],
    "weapons": ["(sharp or or forked or blunt) metal dentures"],
    "armor": [],
    "special": "Eaters are immune to mundane ingested poisons. They may also identify any object if eaten on a successful Test of Gastrology."
  },
  "36": {
    "background": "Monkeymonger",
    "skills": [
      {"Climb": 4},
      {"Trapping": 2},
      {"Club Fighting": 1},
      {"Knife Fighting": 1}
    ],
    "inventory": [],
    "weapons": ["monkey club", "butcher's knife"],
    "armor": ["1d6 small monkeys", "pocket full of monkey treats"],
    "special": "The GM may choose to roll on the table anytime the Mien of monkeys must be determined."
  },
  "41": {
    "background": "Necromancer",
    "skills": [
      {"Healing": 2},
      {"Mortuary Science": 2},
      {"Relationship Counseling": 2},
      {"Spell – Posthumous Vitality": 1},
      {"Spell – Skeletal Counsel": 1},
      {"Spell – Torpor": 1},
      {"Sneak": 1}
    ],
    "inventory": [
      "the skull of your master or zombie servant or ghost"
    ],
    "weapons": [],
    "armor": ["dusty robes"]
  },
  "42": {
    "background": "Parchment Witch",
    "skills": [
      {"Spell – Protection From Rain": 2},
      {"Spell – Callous Strike": 2},
      {"Spell – Quench": 2},
      {"Spell – True Seeing": 2},
      {"Disguise": 2},
      {"Second Sight": 2},
      {"Healing": 1},
      {"Spell – Undo": 1},
      {"Spell – Random": 1}
    ],
    "inventory": [
      "1d6 rolls of parchment",
      "vials of pigments and powders",
      "collection of brushes"
    ],
    "weapons": ["sword cane"],
    "armor": [],
    "special": "You are undead and so do not need to breathe or circulate blood. You take double Damage from Silver Weapons and regain Stamina half as effectively from all sources. You must Test your Luck if outside in the rain, are made wet, are close to open flames, or suffer generally grievous wounds. A failure will see your skin ruined. If your skin is compromised you are very obviously a walking corpse."
  },
  "43": {
    "background": "Poorly Made Dwarf",
    "skills": [
      {"Fist Fighting": 3},
      {"Awareness": 3},
      {"Strength": 2},
      {"Wrestling": 2},
      {"Axe Fighting": 2}
    ],
    "inventory": [
      "empty firkin"
    ],
    "weapons": ["woodsman’s axe"],
    "armor": [],
    "special": "Dwarfs may eat gems and rare metals as food replacements. Genderless. Other Dwarfs will completely ignore you (+4 Sneak)."
  },
  "44": {
    "background": "Questing Knight",
    "skills": [
      {"Jousting": 3},
      {"Sword Fighting": 2},
      {"Spear Fighting": 2},
      {"Shield Fighting": 1},
      {"Awareness": 1}
    ],
    "inventory": [
      "horse",
      "a quixotic undertaking"
    ],
    "weapons": ["lance", "sword", "shield"],
    "armor": ["heavy armour"]
  },
  "45": {
    "background": "Red Priest",
    "skills": [
      {"Spell – Ember": 2},
      {"Spell – Fire Bolt": 2},
      {"Spell – Flash": 2},
      {"Great Axe Fighting": 2},
      {"Second Sight": 1},
      {"Spell – Exorcism": 1}
    ],
    "inventory": [
    ],
    "weapons": ["single headed greataxe (greatsword)"],
    "armor": ["red robes", "faceless metal helmet (modest armour)"]
  },
  "46": {
    "background": "Rhino-Man",
    "skills": [
      {"Spear Fighting": 3},
      {"Run": 2},
      {"Strength": 2},
      {"Gambling": 1}
    ],
    "inventory": [
      "knuckle dice",
      "half full firKin of rhino-beer (20 provisions)"
    ],
    "weapons": ["undersized spear", "horn"],
    "armor": ["tiny useless helmet", "thick skin"]
  },
  "51": {
    "background": "Sceptical Lamassu",
    "skills": [
      {"Fly": 3},
      {"Spell – Random": 3},
      {"Spell – Random": 3},
      {"Spell – Random": 3},
      {"Claw Fighting": 2},
      {"Hoof Fighting": 1}
    ],
    "inventory": [
      "incidental sacred jewellery"
    ],
    "weapons": ["claws (sword)", "hooves (club)"],
    "armor": ["pillbox hat", "wings"]
  },
  "52": {
    "background": "Sorcerer of the Academy of Doors",
    "skills": [
      {"Astrology": 3},
      {"Second Sight": 2},
      {"Spell – Astral Reach": 2},
      {"Spell – Teleport": 1},
      {"Spell – Web": 1},
      {"Spell – Random": 1},
      {"Spell – Random": 1},
      {"Spell – Random": 1}
    ],
    "inventory": [
    ],
    "weapons": [],
    "armor": ["small functional door", "flashy robes"]
  },
  "53": {
    "background": "Sorcerer of the College of Friends",
    "skills": [
      {"Secret Signs – Witching Words": 4},
      {"Run": 2},
      {"Climb": 1},
      {"Sleight of Hand": 1},
      {"Swim": 1},
      {"Sneak": 1},
      {"Second Sight": 1},
      {"Spell – Jolt": 1},
      {"Spell – Amity": 1},
      {"Spell – Mirror Selves": 1},
      {"Spell – Protection from Rain": 1},
      {"Spell – Helping Hands": 1},
      {"Spell – Purple Lens": 1},
      {"Spell – Random": 1}
    ],
    "inventory": [
    ],
    "weapons": ["wand"],
    "armor": ["pointed wizard hat", "2d6 wizard biscuits"]
  },
  "54": {
    "background": "Fellow of the Sublime Society of Beef Steaks",
    "skills": [
      {"Fighting Skill of choice": 2},
      {"Wrestling": 2},
      {"Swim": 2},
      {"Climb": 2},
      {"Run": 2},
      {"Fist Fighting": 2},
      {"Grilling": 1}
    ],
    "inventory": [
      "small gridiron",
      "2kg of premium meat cuts",
      "bottle of strong but fancy wine"
    ],
    "weapons": ["weapon of choice"],
    "armor": ["waistcoat"]
  },
  "55": {
    "background": "Temple Knight of Telak the Swordbringer",
    "skills": [
      {"Awareness": 3},
      {"Blacksmithing": 2},
      {"Sword Fighting": 1},
      {"Greatsword Fighting": 1}
    ],
    "inventory": [
    ],
    "weapons": ["6 swords"],
    "armor": ["the blessing of telak"],
    "special": "The blessing of Telak awards you Armour equal to half the number of Swords you carry. You must be overtly armed at all times or else Telak will take this blessing away until you forge and donate to the unarmed a brand new Sword."
  },
  "56": {
    "background": "Thaumaturge",
    "skills": [
      {"Spell – Undo": 3},
      {"Spell – Assume Shape": 2},
      {"Spell – Thunder": 2},
      {"Spell – Random": 2},
      {"Spell – Brittle Twigs": 1},
      {"Spell – Random": 1},
      {"Second Sight": 1},
      {"Astrology": 1}
    ],
    "inventory": [
    ],
    "weapons": ["staff with charms & bells."],
    "armor": ["thaumaturgic fez", "curled shoes", "voluminous robes"],
    "special": "May reroll one die on the Oops! Table if using this staff, however, may never sneak up on anyone because of the ringing and clattering it makes.  You may Test your Luck to just so happen to have exactly the (common) mystic tchotchke, bauble, or gewgaw the situation requires."
  },
  "61": {
    "background": "Thinking Engine",
    "skills": [
      {"Golden Barge Pilot": 3},
      {"Astrology": 2},
      {"Pistolet Fighting": 2},
      {"Healing": 2},
      {"Run": 1},
      {"Strength": 1},
      {"Cooking": 1}
    ],
    "inventory": [
      "soldering iron",
      "detachable hands or centaur body (+4 run) or inbuilt particle detector (+4 second sight) or one random spell at rank 3."
    ],
    "weapons": [],
    "armor": ["body (light armour)"],
    "special": "You don’t recover Stamina by resting. For each hour of rest welding your skin with a hot iron you regain 3 Stamina. You may recharge plasmic machines at a rate of 1 Stamina and 6 minutes per charge."
  },
  "62": {
    "background": "Vengeful Child",
    "skills": [
      {"Longsword Fighting": 3},
      {"Awareness": 1},
      {"Climb": 1},
      {"Bow Fighting": 1},
      {"Run": 1},
      {"Swim": 1},
      {"Vengeance": 1}
    ],
    "inventory": [
    ],
    "weapons": ["too-large sword (+1 longsword fighting, +1 damage)", "old hunting bow", "12 arrows"],
    "armor": []
  },
  "63": {
    "background": "Venturesome Academic",
    "skills": [
      {"Evaluate": 2},
      {"Astrology": 2},
      {"Healing": 1},
      {"Spell – Random": 1},
      {"Sword Fighting": 1},
      {"Sleight of Hand": 1}
    ],
    "inventory": [
      "reading glasses in a sturdy case",
      "bundle of candles and matches",
      "writing materials",
      "journal"
    ],
    "weapons": ["small sword"],
    "armor": [],
    "special": "You may Test your Luck to recall facts that you might reasonably be expected to have encountered relating to the natural sciences and humanities."
  },
  "64": {
    "background": "Wizard Hunter",
    "skills": [
      {"Tracking": 2},
      {"Disguise": 2},
      {"Crossbow Fighting": 2},
      {"Sword Fighting": 1},
      {"Sneak": 1},
      {"Locks": 1},
      {"Etiquette": 1}
    ],
    "inventory": [
      "large sack",
      "witch-hair rope",
      "1d6 pocket gods",
      "ruby lorgnette"
    ],
    "weapons": ["sword", "crossbow", "12 bolts"],
    "armor": []
  },
  "65": {
    "background": "Yongardy Lawyer",
    "skills": [
      {"Fighting chosen Weapon": 4},
      {"Etiquette": 2},
      {"Healing": 1}
    ],
    "inventory": [
      "manual on Yongardy law"
    ],
    "weapons": ["rapier or sjambok (club) or longsword or hammer"],
    "armor": ["puffy shirt or lots of scars or heavy armour or gargantuan shield", "barrister's wig"]
  },
  "66": {
    "background": "Zoanthrop",
    "skills": [
      {"Climb": 3},
      {"Run": 3},
      {"Strength": 2},
      {"Fist Fighting": 2},
      {"Club Fighting": 2},
      {"Wrestling": 2}
    ],
    "inventory": false,
    "weapons": [],
    "armor": [],
    "special": "Immune to all mind altering effects. You are able to speak but usually choose not to. When making Advancement Checks for Skills related to abstract thought, such as Spells or Astrology, you must roll twice and succeed on both to improve them."
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let keys = Object.keys(backgrounds);

    let bgData = [];

    for(let i = 0; i < keys.length; i++) {
      let record = backgrounds[keys[i]];
      let name = record.background;
      delete record.background;

      let bg = {
        key: keys[i],
        name: name,
        info: JSON.stringify(record),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      bgData.push(bg);
    }

    await queryInterface.bulkInsert('backgrounds', bgData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('backgrounds', null, {});
  }
};
