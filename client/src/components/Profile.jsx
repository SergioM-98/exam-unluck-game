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
                    <h2><strong>Your Games:</strong></h2>
                    <Row>
                        {games.map((game, idx) => (
                            <Col
                                key={game.id || idx}
                                md={6}
                                className="mb-4"
                                style={{ paddingLeft: "32px", paddingRight: "32px" }}
                            >
                                <Row className="p-3 border rounded bg-light">
                                    <Col xs={12}><h3><strong>Game #{game.gameId}</strong></h3></Col>
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong>Date:</strong></Col>
                                        <Col xs={8}>{game.date}</Col>
                                    </Row>
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong>Initial Card 1:</strong></Col>
                                        <Col xs={8}><em>{game.initialCard1.name}</em></Col>
                                    </Row>
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong>Initial Card 2:</strong></Col>
                                        <Col xs={8}><em>{game.initialCard2.name}</em></Col>
                                    </Row>
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong>Initial Card 3:</strong></Col>
                                        <Col xs={8}><em>{game.initialCard3.name}</em></Col>
                                    </Row>
                                    {/* Round 1 */}
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong>Round 1:</strong></Col>
                                        <Col xs={8}>
                                            <em>{game.round1.card.name}</em><br />
                                            <strong>{game.round1.won ? "Card Won" : "Card Lost"}</strong>
                                        </Col>
                                    </Row>
                                    {/* Round 2 */}
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong>Round 2:</strong></Col>
                                        <Col xs={8}>
                                            <em>{game.round2.card.name}</em><br />
                                            <strong>{game.round2.won ? "Card Won" : "Card Lost"}</strong>
                                        </Col>
                                    </Row>
                                    {/* Round 3 */}
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong>Round 3:</strong></Col>
                                        <Col xs={8}>
                                            <em>{game.round3.card.name}</em><br />
                                            <strong>{game.round3.won ? "Card Won" : "Card Lost"}</strong>
                                        </Col>
                                    </Row>
                                    {/* Round 4 */}
                                    {game.round4 && (
                                        <Row className="mb-2 w-100">
                                            <Col xs={4}><strong>Round 4:</strong></Col>
                                            <Col xs={8}>
                                                <em>{game.round4.card.name}</em><br />
                                                <strong>{game.round4.won ? "Card Won" : "Card Lost"}</strong>
                                            </Col>
                                        </Row>
                                    )}
                                    {/* Round 5 */}
                                    {game.round5 && (
                                        <Row className="mb-2 w-100">
                                            <Col xs={4}><strong>Round 5:</strong></Col>
                                            <Col xs={8}>
                                                <em>{game.round5.card.name}</em><br />
                                                <strong>{game.round5.won ? "Card Won" : "Card Lost"}</strong>
                                            </Col>
                                        </Row>
                                    )}
                                </Row>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
}

export default Profile;