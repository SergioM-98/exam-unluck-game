import dayjs from 'dayjs';


function Game(gameId, userId, date=null, situations = [], won = []) {
  this.gameId = gameId;
  this.userId = userId;
  this.date = date && dayjs(date) 
  this.situations = situations;
  this.won = won;
  this.totalWon = this.won.filter(w => w !== null || w !== undefined).length;
}

function Situation(situationId, name, image, index) {
  this.situationId = situationId;
  this.name = name;
  this.image = image;
  this.index = index;
}


export { Game, Situation };