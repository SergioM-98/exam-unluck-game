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
        <Container className="mt-4">
            {games.length === 0 ? (
                <h1>games non trovati</h1>
            ) : (
                <>
                    <h2>Le tue partite</h2>
                    <Row>
                        {games.map((game, idx) => (
                            <Col key={game.id || idx} md={4} className="mb-3">
                                <div className="p-3 border rounded bg-light">
                                    <h5>Game #{game.id}</h5>
                                    <p>Data: {game.date}</p>
                                    <p>Totale vinto: {game.totalWon}</p>
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