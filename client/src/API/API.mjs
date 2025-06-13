import { Game, Round, Card } from "../models/GameModels.mjs";

const SERVER_URL = "http://localhost:3001";

// API ROUTES:
// 1. GET    /api/users/:userId/games         - Returns all games for a specific user
const getGamesByUserId = async (userId) => {
    const response = await fetch(`${SERVER_URL}/api/users/${userId}/games`, {
        method: 'GET',
        credentials: 'include', // Include cookies for session management
    });
    if (response.ok){
        const gamesData = await response.json();
        return gamesData.map(game => new Game(
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
    }
}
// 2. GET    /api/cards                       - Returns a list of random cards (with optional filters)
// 3. GET    /api/cards/:cardId               - Returns the card with the specified id
// 4. POST   /api/games                       - Creates a new game with the provided data
// 5. PUT    /api/games/:gameId               - Updates the rounds of a game
// 6. POST   /api/games/:gameId/rounds        - Creates rounds for a specific game
// 7. POST   /api/sessions                    - Authenticates a user and starts a session
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
// 8. GET    /api/sessions/current            
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

//DELETE /api/sessions/current           
const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}