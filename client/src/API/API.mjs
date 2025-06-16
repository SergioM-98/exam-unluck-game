import { Game, Round, Card } from "../models/GameModels.mjs";
import dayjs from "dayjs";

const SERVER_URL = "http://localhost:3001";

// 1. GET    /api/users/:userId/games         - Returns all games for a specific user
const getGamesByUserId = async (userId) => {
  const response = await fetch(`${SERVER_URL}/api/users/${userId}/games`, {
    credentials: 'include',
  });
  if (response.ok) {
    const games = await response.json();
    return games.map(game => new Game(
      game.gameId,
      game.userId,
      game.date,
      new Card(game.initialCard1.cardId, game.initialCard1.name, game.initialCard1.image, game.initialCard1.index),
      new Card(game.initialCard2.cardId, game.initialCard2.name, game.initialCard2.image, game.initialCard2.index),
      new Card(game.initialCard3.cardId, game.initialCard3.name, game.initialCard3.image, game.initialCard3.index),
      new Round(game.round1.roundId, game.round1.startedAt, game.round1.cardId, game.round1.roundNumber, game.round1.won, game.round1.gameId),
      new Round(game.round2.roundId, game.round2.startedAt, game.round2.cardId, game.round2.roundNumber, game.round2.won, game.round2.gameId),
      new Round(game.round3.roundId, game.round3.startedAt, game.round3.cardId, game.round3.roundNumber, game.round3.won, game.round3.gameId),
      game.round4 ? new Round(game.round4.roundId, game.round4.startedAt, game.round4.cardId, game.round4.roundNumber, game.round4.won, game.round4.gameId) : null,
      game.round5 ? new Round(game.round5.roundId, game.round5.startedAt, game.round5.cardId, game.round5.roundNumber, game.round5.won, game.round5.gameId) : null,
      game.totalWon
    ));
  } else {
    throw await response.text();
  }
};
// 2. GET    /api/rounds/:roundNumber/cards   - Returns a list of random cards with optional filters
const getCards = async (roundNumber, filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${SERVER_URL}/api/rounds/${roundNumber}/cards?${queryParams}`, {
    credentials: 'include',
  });
  if (response.ok) {
    const cards = await response.json();
    return cards.map(card => new Card(
      card.cardId,
      card.name,
      card.image,
      card.index !== undefined ? card.index : null
    ));
  } else {
    throw await response.text();
  }
  };
  
// 3. GET    /api/rounds/:roundNumber/cards/:cardId - Returns the card with the specified id for a specific round, only if it was drawn in this round
const getCardById = async (roundNumber, cardId) => {
  const response = await fetch(`${SERVER_URL}/api/rounds/${roundNumber}/cards/${cardId}`, {
    credentials: 'include',
  });
  if (response.ok) {
    const card = await response.json();
    return new Card(card.cardId, card.name, card.image, card.index);
  } else {
    throw await response.text();
  }
};
// 4. POST   /api/games                       - Creates a new game with the provided data at the end of the game (uses initial cards from session)
const saveGame = async (gameData) => {
  const response = await fetch(SERVER_URL + '/api/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(gameData),
  });
  if (response.ok) {
    const game = await response.json();
    return new Game(
      game.gameId,
      game.userId,
      game.date,
      new Card(game.initialCard1.cardId, game.initialCard1.name, game.initialCard1.image, game.initialCard1.index),
      new Card(game.initialCard2.cardId, game.initialCard2.name, game.initialCard2.image, game.initialCard2.index),
      new Card(game.initialCard3.cardId, game.initialCard3.name, game.initialCard3.image, game.initialCard3.index),
      null,
      null,
      null,
      null,
      null,
      game.totalWon
    );
  } else {
    throw await response.text();
  }
};
// 5. PUT    /api/games/:gameId               - Updates the rounds of a game
const updateGameRounds = async (gameId, rounds) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ roundIds: rounds }),
  });
  if (response.ok) {
    const game = await response.json();
    return new Game(
      game.gameId,
      game.userId,
      game.date,
      new Card(game.initialCard1.cardId, game.initialCard1.name, game.initialCard1.image, game.initialCard1.index),
      new Card(game.initialCard2.cardId, game.initialCard2.name, game.initialCard2.image, game.initialCard2.index),
      new Card(game.initialCard3.cardId, game.initialCard3.name, game.initialCard3.image, game.initialCard3.index),
      new Round(game.round1.roundId, game.round1.startedAt, game.round1.cardId, game.round1.roundNumber, game.round1.won, game.round1.gameId),
      new Round(game.round2.roundId, game.round2.startedAt, game.round2.cardId, game.round2.roundNumber, game.round2.won, game.round2.gameId),
      new Round(game.round3.roundId, game.round3.startedAt, game.round3.cardId, game.round3.roundNumber, game.round3.won, game.round3.gameId),
      game.round4 ? new Round(game.round4.roundId, game.round4.startedAt, game.round4.cardId, game.round4.roundNumber, game.round4.won, game.round4.gameId) : null,
      game.round5 ? new Round(game.round5.roundId, game.round5.startedAt, game.round5.cardId, game.round5.roundNumber, game.round5.won, game.round5.gameId) : null,
    );
  } else {
    throw await response.text();
  }
};
// 6. POST   /api/games/:gameId/rounds        - Creates rounds for a specific game (uses the cardId saved in session for each round)
const saveRounds = async (gameId, rounds) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/rounds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({rounds}),
  });
  if (response.ok) {
    const {roundIds} = await response.json();
    return roundIds;
  } else {
    throw await response.text();
  }
};
// 7. POST   /api/rounds/:roundNumber/timers  - Saves a timer for a round (works for both logged and guest users)
const saveTimer = async (roundNumber, timerData) => {
  const response = await fetch(`${SERVER_URL}/api/rounds/${roundNumber}/timers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ startedAt: timerData }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw await response.text();
  }
};
// 8. POST   /api/rounds/:roundNumber/timers/validate - Validates the timer for a round (max 30 seconds + margin)
const validateTimer = async (roundNumber) => {
  const response = await fetch(`${SERVER_URL}/api/rounds/${roundNumber}/timers/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw await response.text();
  }
};
// 9. POST   /api/sessions                    - Authenticates a user and starts a session

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

// 10. GET   /api/sessions/current            - Returns the current authenticated user
const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {

    return user;
  } else {
    throw user;  
  }
};

// 11. DELETE /api/sessions/current           - Logs out the current user and ends the session
    
const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const API = {
  getGamesByUserId,
  getCards,
  getCardById,
  saveGame,
  updateGameRounds,
  saveRounds,
  saveTimer,
  validateTimer,
  logIn,
  getUserInfo,
  logOut,
  };
  export default API;