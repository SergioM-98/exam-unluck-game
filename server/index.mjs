// Imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { check, validationResult } from 'express-validator';
import { getCards, getGamesByUserId, addGame, addRound, getCardById, updateGame } from './dao-games.mjs';
import { getUser } from './dao-users.mjs';
import dayjs from 'dayjs';

// Initialize express app
const app = new express();
const port = 3001;

// Middleware setup
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173', // React app URL
  optionsSuccessStatus: 200,
  credentials: true, // Allow cookies to be sent
}
app.use(cors(corsOptions));

// Passport authentication setup
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

// Middleware to check if user is authenticated
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

// Session setup
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

app.use('/img', express.static('img'));
/* ROUTES */

/* GET /api/users/:userId/games
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

/* GET /api/rounds/:roundNumber/cards
   - Returns a list of random cards for a round, with optional filters.
   - Query params:
     - bannedCards: list of card ids to exclude (comma separated)
     - num: number of cards to draw (default: 1)
     - visibility: hide index if false
*/
app.get('/api/rounds/:roundNumber/cards', async (req, res) => {
  let { bannedCards, num = 1, visibility } = req.query;
  req.query.visibility === 'false' ? visibility = false : visibility = true;

  let bannedCardsId = [];
  if (bannedCards) {
    bannedCardsId = bannedCards.split(',').map(id => parseInt(id));
  }

  try {
    const cards = await getCards(bannedCardsId, parseInt(num));
    if (!visibility) {
      cards.forEach(card => delete card.index);
    }
    if(parseInt(num) === 1){

      if (!req.session.drawnCards) req.session.drawnCards = {};
      req.session.drawnCards[req.params.roundNumber] = cards;
    }
    else {

      if (req.session.initialCards && req.isAuthenticated()) {
        return res.status(400).json({ error: 'Initial cards have already been drawn for this game.' });
      }
      delete req.session.initialCards; 
      delete req.session.drawnCards; 
      delete req.session.timers;
      delete req.session.rounds;
      req.session.initialCards = cards;
    }
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve cards' });
  }
});

/* GET /api/rounds/:roundNumber/cards/:cardId
   - Returns the card with the specified id for a specific round.
   - Checks if the card was drawn in this round.
*/
app.get('/api/rounds/:roundNumber/cards/:cardId', async (req, res) => {
  const cardId = parseInt(req.params.cardId);
  if (isNaN(cardId)) {
    return res.status(400).json({ error: 'Invalid card ID' });
  }
  if (cardId !== req.session.drawnCards[req.params.roundNumber]?.[0]?.cardId) {
    return res.status(400).json({ error: 'Card not drawn in this round' });
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

/* POST /api/games
   - Creates a new game with the provided data at the end of the game.
   - Uses the initial cards saved in session (req.session.initialCards) for the game.
   - Body: { userId, date, totalWon }
*/
app.post('/api/games',
  [
    check('userId').isInt(),
    check('date').custom(value => {
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
}),
    check('totalWon').isInt()
  ],
  isLoggedIn,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { userId, date, totalWon } = req.body;

    const initialCards = req.session.initialCards;
    delete req.session.initialCards; 
    if (!initialCards || initialCards.length !== 3) {
      return res.status(400).json({ error: 'Initial cards not found in session or invalid' });
    }

    try {
      const [initialCard1, initialCard2, initialCard3] = initialCards;
      const gameId = await addGame({
        userId,
        date,
        initialCard1: initialCard1.cardId,
        initialCard2: initialCard2.cardId,
        initialCard3: initialCard3.cardId,
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

/* PATCH /api/games/:gameId
   - Updates the rounds of a game.
   - Body: { roundIds: [id1, id2, id3, id4, id5] }
*/
app.patch('/api/games/:gameId',
  [
    check('roundsIds').isArray({ min: 3, max: 5 })
  ],
  isLoggedIn,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const gameId = parseInt(req.params.gameId);
    const { roundsIds } = req.body;
    if (isNaN(gameId)) {
      return res.status(400).json({ error: 'Missing or invalid gameId' });
    }
    try {
      const updated = await updateGame(gameId, roundsIds);
      if (updated === 0) {
        return res.status(404).json({ error: 'Game not found' });
      }
      res.status(200).json({ gameId, roundsIds });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update game' });
    }
  }
);

/* POST /api/games/:gameId/rounds
   - Creates rounds for a specific game.
   - Body: { rounds: [ { startedAt, roundNumber, won }, ... ] }
   - Uses the cardId saved in session for each round.
*/
app.post('/api/games/:gameId/rounds',
  [
    check('rounds').isArray({ min: 3, max: 5 }),
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

        const drawnCards = req.session.drawnCards?.[round.roundNumber];
        if (!drawnCards || !drawnCards.length) {
          return res.status(400).json({ error: `No drawn card found in session for round ${round.roundNumber}` });
        }
        if(round.won === true) {
          round.won = 1;
        }
        else{
          round.won = 0;
        }

        const cardId = drawnCards[0].cardId;
        const roundId = await addRound({ ...round, cardId, gameId });
        roundIds.push(roundId);
      }
      delete req.session.initialCards; 
      delete req.session.drawnCards; 
      delete req.session.timers;
      delete req.session.rounds;
      res.status(201).json({ roundIds });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save rounds' });
    }
  }
);

/* POST /api/rounds/:roundNumber/timers
   - Saves a timer for a round (works for both logged and guest users).
   - Body: { startedAt: 'HH:mm:ss' }
*/
app.post('/api/rounds/:roundNumber/timers', (req, res) => {
  const { startedAt } = req.body;
  const { roundNumber } = req.params;
  if(!startedAt || !roundNumber) {
    return res.status(400).json({ error: 'Missing startedAt or roundNumber' });
  }

  if (!req.session.timers) req.session.timers = {};
  req.session.timers[roundNumber] = startedAt;
  res.status(201).json({ message: 'Timer saved in session', roundNumber, startedAt });
  
});

/* POST /api/rounds/:roundNumber/timers/validate
   - Validates the timer for a round (max 30 seconds + 1 second margin).
   - Returns { valid: true/false, elapsed: seconds }
*/
app.post('/api/rounds/:roundNumber/timers/validate', (req, res) => {
  const { roundNumber } = req.params;

  
  const startedAt = req.session.timers[roundNumber];
  if (!startedAt) {
    return res.status(400).json({ error: 'No timer found for this round' });
  }


  const MARGIN_SECONDS = 0.5;

  const startedAtMoment = dayjs(startedAt, 'HH:mm:ss');
  const now = dayjs();

  const elapsed = startedAtMoment.diff(now, 'second');

  const valid = elapsed <= (30 + MARGIN_SECONDS);

  res.json({ valid, elapsed });
});

/* POST /api/sessions
   - Authenticates a user and starts a session.
*/
app.post('/api/sessions', passport.authenticate('local'), function(req, res) {
  return res.status(200).json(req.user);
});

/* GET /api/sessions/current
   - Returns the current authenticated user.
*/
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

/* DELETE /api/sessions/current
   - Logs out the current user and ends the session.
*/
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });