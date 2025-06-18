import db from './db.mjs';
import {Game, Card, Round} from './GamesModels.mjs';
import dayjs from 'dayjs';


export async function getGamesByUserId(userId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT 
                            games.id_game AS game_id,
                            games.id_player,
                            games.date,
                            games.initial_card1, games.initial_card2, games.initial_card3,
                            games.round1, games.round2, games.round3, games.round4, games.round5,
                            games.total_won,

                            -- Carte iniziali
                            card1.id_card AS card1_id, card1.name AS card1_name, card1.image AS card1_image, card1.unluck_index AS card1_unluck_index,
                            card2.id_card AS card2_id, card2.name AS card2_name, card2.image AS card2_image, card2.unluck_index AS card2_unluck_index,
                            card3.id_card AS card3_id, card3.name AS card3_name, card3.image AS card3_image, card3.unluck_index AS card3_unluck_index,

                            -- Round 1
                            round1.id_round AS round1_id_round, round1.started_at AS round1_started_at, round1.round_number AS round1_round_number, round1.won AS round1_won, round1.id_game AS round1_id_game,
                            round1_card.id_card AS round1_card_id, round1_card.name AS round1_card_name, round1_card.image AS round1_card_image, round1_card.unluck_index AS round1_card_unluck_index,

                            -- Round 2
                            round2.id_round AS round2_id_round, round2.started_at AS round2_started_at, round2.round_number AS round2_round_number, round2.won AS round2_won, round2.id_game AS round2_id_game,
                            round2_card.id_card AS round2_card_id, round2_card.name AS round2_card_name, round2_card.image AS round2_card_image, round2_card.unluck_index AS round2_card_unluck_index,

                            -- Round 3
                            round3.id_round AS round3_id_round, round3.started_at AS round3_started_at, round3.round_number AS round3_round_number, round3.won AS round3_won, round3.id_game AS round3_id_game,
                            round3_card.id_card AS round3_card_id, round3_card.name AS round3_card_name, round3_card.image AS round3_card_image, round3_card.unluck_index AS round3_card_unluck_index,

                            -- Round 4
                            round4.id_round AS round4_id_round, round4.started_at AS round4_started_at, round4.round_number AS round4_round_number, round4.won AS round4_won, round4.id_game AS round4_id_game,
                            round4_card.id_card AS round4_card_id, round4_card.name AS round4_card_name, round4_card.image AS round4_card_image, round4_card.unluck_index AS round4_card_unluck_index,

                            -- Round 5
                            round5.id_round AS round5_id_round, round5.started_at AS round5_started_at, round5.round_number AS round5_round_number, round5.won AS round5_won, round5.id_game AS round5_id_game,
                            round5_card.id_card AS round5_card_id, round5_card.name AS round5_card_name, round5_card.image AS round5_card_image, round5_card.unluck_index AS round5_card_unluck_index

                        FROM games
                        JOIN cards AS card1 ON games.initial_card1 = card1.id_card
                        JOIN cards AS card2 ON games.initial_card2 = card2.id_card
                        JOIN cards AS card3 ON games.initial_card3 = card3.id_card

                        JOIN rounds AS round1 ON games.round1 = round1.id_round
                        JOIN rounds AS round2 ON games.round2 = round2.id_round
                        JOIN rounds AS round3 ON games.round3 = round3.id_round
                        LEFT JOIN rounds AS round4 ON games.round4 = round4.id_round
                        LEFT JOIN rounds AS round5 ON games.round5 = round5.id_round

                        JOIN cards AS round1_card ON round1.id_card = round1_card.id_card
                        JOIN cards AS round2_card ON round2.id_card = round2_card.id_card
                        JOIN cards AS round3_card ON round3.id_card = round3_card.id_card
                        LEFT JOIN cards AS round4_card ON round4.id_card = round4_card.id_card
                        LEFT JOIN cards AS round5_card ON round5.id_card = round5_card.id_card

                        WHERE games.id_player = ?`;
        db.all(query, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const games = rows.map(row => {
                    return new Game(
                        row.game_id,
                        row.id_player,
                        row.date,
                        new Card(row.card1_id, row.card1_name, row.card1_image, row.card1_unluck_index),
                        new Card(row.card2_id, row.card2_name, row.card2_image, row.card2_unluck_index),
                        new Card(row.card3_id, row.card3_name, row.card3_image, row.card3_unluck_index),
                        new Round(
                            row.round1_id_round, row.round1_started_at,
                            new Card(row.round1_card_id, row.round1_card_name, row.round1_card_image, row.round1_card_unluck_index),
                            row.round1_round_number, row.round1_won, row.round1_id_game
                        ),
                        new Round(
                            row.round2_id_round, row.round2_started_at,
                            new Card(row.round2_card_id, row.round2_card_name, row.round2_card_image, row.round2_card_unluck_index),
                            row.round2_round_number, row.round2_won, row.round2_id_game
                        ),
                        new Round(
                            row.round3_id_round, row.round3_started_at,
                            new Card(row.round3_card_id, row.round3_card_name, row.round3_card_image, row.round3_card_unluck_index),
                            row.round3_round_number, row.round3_won, row.round3_id_game
                        ),
                        row.round4_id_round ? new Round(
                            row.round4_id_round, row.round4_started_at,
                            new Card(row.round4_card_id, row.round4_card_name, row.round4_card_image, row.round4_card_unluck_index),
                            row.round4_round_number, row.round4_won, row.round4_id_game
                        ) : null,
                        row.round5_id_round ? new Round(
                            row.round5_id_round, row.round5_started_at,
                            new Card(row.round5_card_id, row.round5_card_name, row.round5_card_image, row.round5_card_unluck_index),
                            row.round5_round_number, row.round5_won, row.round5_id_game
                        ) : null,
                        row.total_won
                    );
                });
                resolve(games.sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1));

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

export async function updateGame(gameId, roundsIds) {
    const [r1, r2, r3, r4, r5] = roundsIds;
    return new Promise((resolve, reject) => {
        const query = `UPDATE games
                        SET round1 = ?, round2 = ?, round3 = ?, round4 = ?, round5 = ?
                        WHERE id_game = ?`;
        db.run(query, [r1, r2, r3, r4, r5, gameId], function(err) {
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
