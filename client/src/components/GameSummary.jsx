import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import GameCard from './GameCard';

function GameSummary(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const cardsInHand = location.state?.cardsInHand || [];
  const loggedIn = props.loggedIn;

  useEffect(() => {
    props.setHideLinks(false);
  }, []);

  const handlePlayAgain = async () => {
    props.setHideLinks(true);
    if (props.onStartGame) await props.onStartGame();
    navigate("/games");
  };

  const gameWon = (loggedIn && cardsInHand.length === 6) || (!loggedIn && cardsInHand.length === 4);

  return (
    <Container fluid className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <h2 className="mb-4">{gameWon ? "Game won!" : "Game Lost"}</h2>
      <Row className="mb-4" style={{ justifyContent: "center" }}>
        {cardsInHand.map((card, idx) => (
          <Col key={idx} xs="auto" className="mb-2">
            <GameCard {...card} />
          </Col>
        ))}
      </Row>
      <div className="d-flex gap-3">
        <Button variant="btn btn-dark mb-2" onClick={handlePlayAgain}>
          Play Again
        </Button>
        <Button variant="btn btn-dark mb-2" onClick={() => navigate('/')}>
          Home
        </Button>
      </div>
    </Container>
  );
}

export default GameSummary;