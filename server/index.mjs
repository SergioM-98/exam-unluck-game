// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { check, validationResult } from 'express-validator';
import { getCards, getGamesByUserId, addGame, addRound, getCardById } from './dao-games.mjs';
import { getUser } from './dao-users.mjs';


// init express
const app = new express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173', // React app URL
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true, // Allow cookies to be sent
}

app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/* Routes */

/* 1. GET /api/users/:userId/games
   - Returns all games for a specific user.
*/
app.get('/api/users/:userId/games', isLoggedIn, async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  getGamesByUserId(userId)
    .then(games => {
      if (games.length === 0) {
        return res.json([]);
      }
      res.json(games);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve games' });
    });
});

/* 2. GET /api/cards
   Optional query params:
   - bannedCards: list of card ids to exclude (comma separated)
   - num: number of cards to draw (default: 1)
   - visibility: hide index if false
   - Returns a list of random cards, filtered and if requested without index.
*/
app.get('/api/cards', async (req, res) => {
  let { bannedCards, num = 1, visibility = true } = req.query;
  req.query.visibility === 'true' ? visibility = true : visibility = false;

  let bannedCardsId = [];
  if (bannedCards) {
    bannedCardsId = bannedCards.split(',').map(id => parseInt(id));
  }

  try {
    const cards = await getCards(bannedCardsId, parseInt(num));
    if (!visibility) {
      cards.forEach(card => delete card.index);
    }
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve cards' });
  }
});

/* 3. GET /api/cards/:cardId
   - Returns the card with the specified id.
*/
app.get('/api/cards/:cardId', async (req, res) => {
  const cardId = parseInt(req.params.cardId);
  if (isNaN(cardId)) {
    return res.status(400).json({ error: 'Invalid card ID' });
  }
  
  try {
    const card = await getCardById(cardId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve card' });
  }
});


/* 4. POST /api/games
   - Creates a new game with the provided data.
   - Body: { userId, date, initialCards, totalWon }
*/
app.post('/api/games',
  [
    check('userId').isInt(),
    check('date').isDate({ format: 'YYYY-MM-DD HH:mm:ss', strictMode: true }),
    check('initialCards').isArray({ min: 3, max: 3 }),
    check('totalWon').isInt()
  ],
  isLoggedIn,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { userId, date, initialCards, totalWon } = req.body;
    try {
      const [initialCard1, initialCard2, initialCard3] = initialCards;
      const gameId = await addGame({
        userId,
        date,
        initialCard1,
        initialCard2,
        initialCard3,
        round1: null,
        round2: null,
        round3: null,
        round4: null,
        round5: null,
        totalWon
      });
      res.status(201).json({ gameId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save game' });
    }
  }
);

/* 5. PUT /api/games/:gameId
   - Updates the rounds of a game.
   - Body: { roundIds: [id1, id2, id3, id4, id5] }
*/
app.put('/api/games/:gameId',
  [
    check('roundIds').isArray({ min: 3, max: 5 })

  ],
  isLoggedIn,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const gameId = parseInt(req.params.gameId);
    const { roundIds } = req.body;
    if (isNaN(gameId)) {
      return res.status(400).json({ error: 'Missing or invalid gameId' });
    }
    try {
      await updateGame(gameId, roundIds);
      res.status(200).json({ message: 'Game updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update game' });
    }
  }
);

/* 6. POST /api/games/:gameId/rounds
   - Creates rounds for a specific game.
   - Body: { rounds: [ { startedAt, cardId, roundNumber, won }, ... ] }
*/
app.post('/api/games/:gameId/rounds',
  [
    check('rounds').isArray({ min: 3, max: 5 }),
    check('rounds.*.startedAt').isDate({ format: 'HH:mm:ss', strictMode: true }),
    check('rounds.*.cardId').isInt(),
    check('rounds.*.roundNumber').isInt({ min: 1, max: 5 }),
    check('rounds.*.won').isBoolean()
  ],
  isLoggedIn,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const gameId = parseInt(req.params.gameId);
    const rounds = req.body.rounds;
    if (isNaN(gameId)) {
      return res.status(400).json({ error: 'Missing or invalid gameId' });
    }
    try {
      const roundIds = [];
      for (const round of rounds) {
        const roundId = await addRound({ ...round, gameId });
        roundIds.push(roundId);
      }
      res.status(201).json({ roundIds });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save rounds' });
    }
  }
);

/* 7. POST /api/sessions
   - Authenticates a user and starts a session.
*/
app.post('/api/sessions', passport.authenticate('local'), function(req, res) {
  return res.status(201).json(req.user);
});

/* 8. GET /api/sessions/current
   - Returns the current authenticated user.
*/
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

/* 9. DELETE /api/sessions/current
   - Logs out the current user and ends the session.
*/
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// start the server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });