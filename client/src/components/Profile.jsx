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
            }
        } catch (error) {
            // error handling silenziato
        }
    }

    useEffect(() => {
        getGames()
    }, []);

    return (
        <Container className="mt-5">
            {games.length === 0 ? (
                <h1 style={{ color: "#000" }}>games not found</h1>
            ) : (
                <>
                    <h2><strong style={{ color: "#000" }}>Your Games:</strong></h2>
                    <Row>
                        {games.map((game, idx) => (
                            <Col
                                key={game.id || idx}
                                md={6}
                                className="mb-4"
                                style={{ paddingLeft: "32px", paddingRight: "32px" }}
                            >
                                <Row className="p-3 border rounded bg-light">
                                    <Col xs={12}>
                                        <h3>
                                            <span style={{ color: "#000" }}>
                                                <strong>
                                                    Game #{game.gameId}: {game.totalWon === 3 ? "Won" : "Lost"}
                                                </strong>
                                            </span>
                                        </h3>
                                    </Col>
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong style={{ color: "#000" }}>Date:</strong></Col>
                                        <Col xs={8} style={{ color: "#000" }}>{game.date}</Col>
                                    </Row>
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong style={{ color: "#000" }}>Initial Card 1:</strong></Col>
                                        <Col xs={8}><em style={{ color: "#000" }}>{game.initialCard1.name}</em></Col>
                                    </Row>
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong style={{ color: "#000" }}>Initial Card 2:</strong></Col>
                                        <Col xs={8}><em style={{ color: "#000" }}>{game.initialCard2.name}</em></Col>
                                    </Row>
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong style={{ color: "#000" }}>Initial Card 3:</strong></Col>
                                        <Col xs={8}><em style={{ color: "#000" }}>{game.initialCard3.name}</em></Col>
                                    </Row>
                                    {/* Round 1 */}
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong style={{ color: "#000" }}>Round 1:</strong></Col>
                                        <Col xs={8}>
                                            <em style={{ color: "#000" }}>{game.round1.card.name}</em><br />
                                            <strong style={{ color: "#000" }}>{game.round1.won ? "Card Won" : "Card Lost"}</strong>
                                        </Col>
                                    </Row>
                                    {/* Round 2 */}
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong style={{ color: "#000" }}>Round 2:</strong></Col>
                                        <Col xs={8}>
                                            <em style={{ color: "#000" }}>{game.round2.card.name}</em><br />
                                            <strong style={{ color: "#000" }}>{game.round2.won ? "Card Won" : "Card Lost"}</strong>
                                        </Col>
                                    </Row>
                                    {/* Round 3 */}
                                    <Row className="mb-2 w-100">
                                        <Col xs={4}><strong style={{ color: "#000" }}>Round 3:</strong></Col>
                                        <Col xs={8}>
                                            <em style={{ color: "#000" }}>{game.round3.card.name}</em><br />
                                            <strong style={{ color: "#000" }}>{game.round3.won ? "Card Won" : "Card Lost"}</strong>
                                        </Col>
                                    </Row>
                                    {/* Round 4 */}
                                    {game.round4 && (
                                        <Row className="mb-2 w-100">
                                            <Col xs={4}><strong style={{ color: "#000" }}>Round 4:</strong></Col>
                                            <Col xs={8}>
                                                <em style={{ color: "#000" }}>{game.round4.card.name}</em><br />
                                                <strong style={{ color: "#000" }}>{game.round4.won ? "Card Won" : "Card Lost"}</strong>
                                            </Col>
                                        </Row>
                                    )}
                                    {/* Round 5 */}
                                    {game.round5 && (
                                        <Row className="mb-2 w-100">
                                            <Col xs={4}><strong style={{ color: "#000" }}>Round 5:</strong></Col>
                                            <Col xs={8}>
                                                <em style={{ color: "#000" }}>{game.round5.card.name}</em><br />
                                                <strong style={{ color: "#000" }}>{game.round5.won ? "Card Won" : "Card Lost"}</strong>
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