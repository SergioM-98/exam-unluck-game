// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import {check, validationResult} from 'express-validator';
import { getCards, getGamesByUserId, addGame, addRound } from './dao-games.mjs';
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

//GET /api/users/<id_user>/games

// GET 3 cards to start a game
// api/games/<id>/cards

// Save a game
// POST /api/games

// add a round 
// POST /api/games/<id>/rounds

// new round draw a card
// GET /api/cards
app.get('/api/cards', async (req, res) => {
  const bannedCards = req.query.bannedCards ? req.query.bannedCards.split(',').map(Number) : [];
  try {
    const cards = await getCards(bannedCards, 1);
    if (!cards || cards.length === 0) {
      return res.status(404).json({ error: 'No cards available' });
    }
    const { index, ...cardWithoutIndex } = cards[0]; 
    res.json(cardWithoutIndex);
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch cards'});
  }
});


// GET /api/cards/:cardId
app.get('/api/cards/:cardId', isLoggedIn, async (req, res) => {
  const cardId = parseInt(req.params.cardId);
  if (isNaN(cardId)) {
    return res.status(400).json({ error: 'Missing or invalid cardId' });
  }
  try {
    const card = await getCardById(cardId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});