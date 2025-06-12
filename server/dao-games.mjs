import db from './db.mjs';
import {Game, Card, Round} from './GamesModels.mjs';
import dayjs from 'dayjs';


export async function getGamesByUserId(userId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT *
                            FROM games
                            JOIN cards AS card1 ON games.initial_card1 = card1.id_card
                            JOIN cards AS card2 ON games.initial_card2 = card2.id_card
                            JOIN cards AS card3 ON games.initial_card3 = card3.id_card
                            JOIN rounds AS round1 ON games.round1 = round1.id_round
                            JOIN rounds AS round2 ON games.round2 = round2.id_round
                            JOIN rounds AS round3 ON games.round3 = round3.id_round
                            LEFT JOIN rounds AS round4 ON games.round4 = round4.id_round
                            LEFT JOIN rounds AS round5 ON games.round5 = round5.id_round
                            WHERE games.id_player = ?`;
        db.all(query, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const games = rows.map(row => {
                    return new Game(
                        row.id_game,
                        row.id_player,
                        row.date,
                        new Card(row['card1.id_card'], row['card1.name'], row['card1.image'], row['card1.index']),
                        new Card(row['card2.id_card'], row['card2.name'], row['card2.image'], row['card2.index']),
                        new Card(row['card3.id_card'], row['card3.name'], row['card3.image'], row['card3.index']),
                        new Round(row['round1.id_round'], row['round1.started_at'], row['round1.card_id'], row['round_number'], row['round1.won'], row['round1.id_game']),
                        new Round(row['round2.id_round'], row['round2.started_at'], row['round2.card_id'], row['round_number'], row['round2.won'], row['round2.id_game']),
                        new Round(row['round3.id_round'], row['round3.started_at'], row['round3.card_id'], row['round_number'], row['round3.won'], row['round3.id_game']),
                        row.round4 ? new Round(row['round4.id_round'], row['round4.started_at'], row['round4.card_id'], row['round_number'], row['round4.won'], row['round4.id_game']) : null,
                        row.round5 ? new Round(row['round5.id_round'], row['round5.started_at'], row['round5.card_id'], row['round_number'], row['round5.won'], row['round5.id_game']) : null,
                        row.totalWon
                    );

                });
                resolve(games.sort((a, b) => dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1));
            }
        });
    });
}

export async function addGame(game) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO games (id_player, date, initial_card1, initial_card2, initial_card3, round1, round2, round3, round4, round5, total_won)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [
            game.userId,
            game.date,
            game.initialCard1,
            game.initialCard2,
            game.initialCard3,
            game.round1,
            game.round2,
            game.round3,
            game.round4 ? game.round4 : null,
            game.round5 ? game.round5 : null,
            game.totalWon
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

export async function updateGame(gameId, roundIds) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE games
                        SET round1 = ?, round2 = ?, round3 = ?, round4 = ?, round5 = ?
                        WHERE id_game = ?`;
        db.run(query, [
            roundIds[0], roundIds[1], roundIds[2], roundIds[3] || null, roundIds[4] || null,
            gameId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}


export async function addRound(round) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO rounds (started_at, id_card, round_number, won, id_game)
                        VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [
            round.startedAt,
            round.cardId,
            round.roundNumber,
            round.won,
            round.gameId
        ], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
// This function retrieves a specified number of cards, excluding those that are already used in the game.
export async function getCards(bannedCardsId = [], numCards) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM cards`;
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Filter out banned cards and shuffle the remaining cards
                const cards = rows
                    .map(row => new Card(row.id_card, row.name, row.image, row.unluck_index))
                    .filter(card => !bannedCardsId.includes(card.cardId));
                resolve(cards.sort(() => Math.random() - 0.5).slice(0, numCards));
            }
        });
    });
}

export async function getCardById(cardId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM cards WHERE id_card = ?`;
        db.get(query, [cardId], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                resolve(null);
            } else {
                resolve(new Card(row.id_card, row.name, row.image, row.unluck_index));
            }
        });
    });
}


