import dayjs from 'dayjs';


function Game(gameId, userId, date, initialCard1, initialCard2, initialCard3, round1, round2, round3, round4, round5, totalWon=null) {
  this.gameId = gameId;
  this.userId = userId;
  this.date = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  this.initialCard1 = initialCard1;
  this.initialCard2 = initialCard2;
  this.initialCard3 = initialCard3;
  this.round1 = round1;
  this.round2 = round2;
  this.round3 = round3;
  this.round4 = round4;
  this.round5 = round5;
  this.totalWon = (totalWon !== null && totalWon !== undefined)
  ? totalWon
  : round1.won + round2.won + round3.won + (round4 ? round4.won : 0) + (round5 ? round5.won : 0);
}

function Card(cardId, name, image, index) {
  this.cardId = cardId;
  this.name = name;
  this.image = image;
  this.index = index;
}

function Round(roundId, startedAt, card, roundNumber, won, gameId){
  this.roundId = roundId;
  this.startedAt = dayjs(startedAt).format('HH:mm:ss');
  this.card = card;
  this.roundNumber = roundNumber;
  this.won = won;
  this.gameId = gameId;
}


export { Game, Card
, Round };