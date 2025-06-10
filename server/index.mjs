// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import {check, validationResult} from 'express-validator';
import { getGamesByUser, getSituations, addGame } from './dao-games.mjs';
import { getUser } from './dao-users.mjs';


// init express
const app = new express();
const port = 3001;

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});