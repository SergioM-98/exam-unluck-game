import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router';
import API from '../API/API.mjs';

function Profile(props) {
    const { idProfile } = useParams();
    const [games, setGames] = useState([]);

    const getGames = async () => {
        try {
            const games = await API.getGamesByUserId(idProfile);
            if (games) {
                setGames(games);
            } else {
                console.error("No games found for this user.");
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getGames()
    }, []);

    return (
        <Container className="mt-5">
            {games.length === 0 ? (
                <h1>games not found</h1>
            ) : (
                <>
                    <h2><b>Your Games:</b></h2>
                    <Row>
                        {games.map((game, idx) => (
                            <Col key={game.id || idx} md={6} className="mb-3">
                                <div className="p-3 border rounded bg-light">
                                    <h3><b>Game #{game.gameId}</b></h3>
                                    <p><b>Date:</b> {game.date}</p>
                                    <p>
                                      <b>Initial Card 1:</b> <i>{game.initialCard1.name}</i>
                                    </p>
                                    <p>
                                      <b>Initial Card 2:</b> <i>{game.initialCard2.name}</i>
                                    </p>
                                    <p>
                                      <b>Initial Card 3:</b> <i>{game.initialCard3.name}</i>
                                    </p>
                                    <p>
                                      <b>Round 1:</b> <i>{game.round1.card.name}</i><br />
                                      <b>{game.round1.won ? "Card Won" : "Card Lost"}</b>
                                    </p>
                                    <p>
                                      <b>Round 2:</b> <i>{game.round2.card.name}</i><br />
                                      <b>{game.round2.won ? "Card Won" : "Card Lost"}</b>
                                    </p>
                                    <p>
                                      <b>Round 3:</b> <i>{game.round3.card.name}</i><br />
                                      <b>{game.round3.won ? "Card Won" : "Card Lost"}</b>
                                    </p>
                                    {game.round4 && (
                                      <p>
                                        <b>Round 4:</b> <i>{game.round4.card.name}</i><br />
                                        <b>{game.round4.won ? "Card Won" : "Card Lost"}</b>
                                      </p>
                                    )}
                                    {game.round5 && (
                                      <p>
                                        <b>Round 5:</b> <i>{game.round5.card.name}</i><br />
                                        <b>{game.round5.won ? "Card Won" : "Card Lost"}</b>
                                      </p>
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
}

export default Profile;