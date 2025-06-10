import dayjs from 'dayjs';


function Game(gameId, userId, date=null, situations = [], indexes = [], won = []) {
  this.gameId = gameId;
  this.userId = userId;
  this.date = date && dayjs(date) 
  this.situations = situations;
  this.indexes = indexes;
  this.won = won;
  this.totalWon = this.won.filter(w => w !== null || w !== undefined).length;
}

function Situation(situationId, name, image, index) {
  this.situationId = situationId;
  this.name = name;
  this.image = image;
  this.index = index;
}

function Round(situation, won) {
  this.situation = situation;
  this.won = won;
}

export { Game, Situation, Round };