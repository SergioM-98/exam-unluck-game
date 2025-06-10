import db from './db.mjs';
import {Game, Situation} from './GamesModels.mjs';

export function getGamesByUser(id_user) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM games WHERE id_user = ?';
        db.all(query, [id_user], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const games = rows.map(row => new Game(
                    row.id_game,
                    row.id_player,
                    row.date,
                    [row.situation1, row.situation2, row.situation3, row.situation4, row.situation5, row.situation6, row.situation7, row.situation8],
                    [row.index1, row.index2, row.index3, row.index4, row.index5, row.index6, row.index7, row.index8],
                    [row.won1, row.won2, row.won3, row.won4, row.won5, row.won6, row.won7, row.won8],
                    row.total_won)
                )
                resolve(games);
            }
        });
    });
}

export function addGame(game) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO games (id_player, date, situation1, situation2, situation3, situation4, situation5, situation6, situation7, situation8,
            index1, index2, index3, index4, index5, index6, index7, index8,
            won1, won2, won3, won4, won5, total_won)
            VALUES (?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(query, [game.userId, game.date, game.situations[0], game.situations[1], game.situations[2], game.situations[3], game.situations[4], game.situations[5], game.situations[6] ?? null, game.situations[7] ?? null,
            game.indexes[0], game.indexes[1], game.indexes[2], game.indexes[3], game.indexes[4], game.indexes[5], game.indexes[6] ?? null, game.indexes[7] ?? null,
            game.won[0] ?? null, game.won[1] ?? null, game.won[2] ?? null, game.won[3] ?? null, game.won[4] ?? null, game.totalWon], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
    });
}

export function getSituations(situationIds = []) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM situations';
        db.all(query, [], (err, rows) => {
            if(err) {
                reject(err);
            }
            else {
                if (situationIds.length > 0) {
                    rows = rows.filter(row => !situationIds.includes(row.id_situation));
                }
                const situations = rows.map(row => new Situation(
                    row.id_situation,
                    row.name,
                    row.image,
                    row.index
                ));
                const randomSituation = situations[Math.floor(Math.random() * situations.length)];
                return resolve(randomSituation);
            }
        });
    });
}
