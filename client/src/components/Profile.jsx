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
                    <h2>Your games</h2>
                    <Row>
                        {games.map((game, idx) => (
                            <Col key={game.id || idx} md={6} className="mb-3">
                                <div className="p-3 border rounded bg-light">
                                    <h3>Game #{game.gameId}</h3>
                                    <p>Date: {game.date}</p>
                                    <p>Initial Card 1: {game.initialCard1.name}</p>
                                    <p>Initial Card 2: {game.initialCard2.name}</p>
                                    <p>Initial Card 3: {game.initialCard3.name}</p>
                                    <p>
                                      Round 1: {game.round1.card.name}<br />
                                      {game.round1.won ? "Card Won" : "Card Lost"}
                                    </p>
                                    <p>
                                      Round 2: {game.round2.card.name}<br />
                                      {game.round2.won ? "Card Won" : "Card Lost"}
                                    </p>
                                    <p>
                                      Round 3: {game.round3.card.name}<br />
                                      {game.round3.won ? "Card Won" : "Card Lost"}
                                    </p>
                                    {game.round4 && (
                                      <p>
                                        Round 4: {game.round4.card.name}<br />
                                        {game.round4.won ? "Card Won" : "Card Lost"}
                                      </p>
                                    )}
                                    {game.round5 && (
                                      <p>
                                        Round 5: {game.round5.card.name}<br />
                                        {game.round5.won ? "Card Won" : "Card Lost"}
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