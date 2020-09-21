import concat from 'lodash-es/concat';

import combatantTypes from 'data/combatantTypes';

const mockPlayers = [
  {
    combatant_id: 'b8a77a90-c3ee-499e-8261-821e7e4e30c7',
    name: 'Grilrom Hammerstone',
    avatar:
      'https://cdnb.artstation.com/p/assets/images/images/000/598/981/large/jorge-pepelife-dwarf.jpg?1443932366',
    ac: 14,
    total_health: 35,
    level: 5,
    character_type: combatantTypes.player,
  },
  {
    combatant_id: '159c9ba1-6e13-455d-81f7-af719d6de8f3',
    name: 'Sventari',
    avatar:
      'https://usercontent.one/wp/kirileonard.com/wp-content/uploads/2018/05/kiri_leonard_vetis_web.jpg',
    ac: 22,
    total_health: 32,
    level: 5,
    character_type: combatantTypes.player,
  },
  {
    combatant_id: 'bc3ee65e-d69d-4595-a65f-7361597176b2',
    name: 'Shakáste',
    avatar:
      'https://vignette.wikia.nocookie.net/criticalrole/images/2/23/BlackSalander_Shak%C3%A4ste_Anastasia.jpg/revision/latest/scale-to-width-down/340?cb=20180804040915',
    ac: 17,
    total_health: 32,
    level: 5,
    character_type: combatantTypes.player,
  },
];

const mockMonsters = [
  {
    combatant_id: 'ecc94626-3199-4171-9a5e-d9c3c88ba723',
    name: 'Red Dragon',
    avatar: 'https://wallpapercave.com/wp/63h5Uh2.jpg',
    ac: 17,
    total_health: 302,
    level: null,
    character_type: combatantTypes.creature,
  },
  {
    combatant_id: 'f60aed01-4f33-4a80-960b-e6fcf717ade1',
    name: 'Skeletal Bones',
    avatar:
      'https://db4sgowjqfwig.cloudfront.net/images/5307667/A2B68F7D-7051-4E76-990D-B37992F9E02F.jpeg',
    ac: 17,
    total_health: 32,
    level: null,
    character_type: combatantTypes.monster,
  },
  {
    combatant_id: 'a4ad17d5-f698-4369-b9c8-5f7736de6c17',
    name: 'Skeletal Bones',
    avatar:
      'https://db4sgowjqfwig.cloudfront.net/images/5307667/A2B68F7D-7051-4E76-990D-B37992F9E02F.jpeg',
    ac: 17,
    total_health: 32,
    level: null,
    character_type: combatantTypes.monster,
  },
  {
    combatant_id: '2b5eba39-5174-447f-ac34-e6d0db16c647',
    name: 'Skeletal Bones',
    avatar:
      'https://db4sgowjqfwig.cloudfront.net/images/5307667/A2B68F7D-7051-4E76-990D-B37992F9E02F.jpeg',
    ac: 17,
    total_health: 32,
    level: null,
    character_type: combatantTypes.monster,
  },
  {
    combatant_id: 'e2136502-3ac9-4d2f-bf51-242b8a114d75',
    name: 'Elite Skeletal Bones',
    avatar:
      'https://db4sgowjqfwig.cloudfront.net/images/5307667/A2B68F7D-7051-4E76-990D-B37992F9E02F.jpeg',
    ac: 17,
    total_health: 32,
    level: null,
    character_type: combatantTypes.monster,
  },
];

const mockEnemies = [
  {
    combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
    name: 'Seghal',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT8dk0jKR7jlTN_M7ydZeO4I_EvIA4AGtomYQ&usqp=CAU',
    ac: 22,
    total_health: 32,
    level: null,
    character_type: combatantTypes.enemy,
  },
];

const mockCharacters = concat(mockPlayers, mockMonsters, mockEnemies);

const mockCombatants = [
  {
    combatant_id: 'b8a77a90-c3ee-499e-8261-821e7e4e30c7',
    initiative: 14,
    complete: false,
    damage: 0,
    deathSaves: [null, null, null],
    dead: false,
  },
  {
    combatant_id: 'bfd56576-37cf-494e-998d-4b5777c06708',
    initiative: 18,
    complete: false,
    damage: 32,
    // deathSaves: [false, undefined, null],
    dead: false,
  },
  {
    combatant_id: '159c9ba1-6e13-455d-81f7-af719d6de8f3',
    initiative: 12,
    complete: false,
    damage: 0,
    deathSaves: [null, null, null],
    dead: false,
  },
  {
    combatant_id: 'ecc94626-3199-4171-9a5e-d9c3c88ba723',
    initiative: 15,
    complete: false,
    damage: 31,
    deathSaves: [null, null, null],
    dead: false,
  },
  {
    combatant_id: 'f60aed01-4f33-4a80-960b-e6fcf717ade1',
    initiative: 18,
    complete: false,
    damage: 25,
    deathSaves: [null, null, null],
    dead: false,
  },
  {
    combatant_id: 'a4ad17d5-f698-4369-b9c8-5f7736de6c17',
    initiative: 18,
    complete: false,
    damage: 15,
    deathSaves: [null, null, null],
    dead: false,
  },
  {
    combatant_id: '2b5eba39-5174-447f-ac34-e6d0db16c647',
    initiative: undefined,
    complete: false,
    damage: 2,
    deathSaves: [null, null, null],
    dead: false,
  },
  {
    combatant_id: 'e2136502-3ac9-4d2f-bf51-242b8a114d75',
    initiative: undefined,
    complete: false,
    damage: 0,
    deathSaves: [null, null, null],
    dead: false,
  },
  {
    combatant_id: 'bc3ee65e-d69d-4595-a65f-7361597176b2',
    initiative: 10,
    complete: false,
    damage: 0,
    deathSaves: [null, null, null],
    dead: false,
  },
];

export {
  mockCharacters,
  mockCombatants,
  mockPlayers,
  mockMonsters,
  mockEnemies,
};
