import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import GameCard from './GameCard';



function GameSummary(props) {
  const navigate = useNavigate();

  return (
    <div className="game-summary text-center d-flex flex-column justify-content-between" style={{ minHeight: "80vh" }}>
      <div>
        <h2>Game Summary</h2>
        <h3>Cards Obtained</h3>
        <Row className="justify-content-center">
          {props.cardsInHand.map((card) => (
            <Col key={card.cardId} xs={12} sm={6} md={4} lg={3} className="mb-3">
              <GameCard {...card} />
            </Col>
          ))}
        </Row>
      </div>
      <div className="w-100 d-flex justify-content-center gap-3 mb-4">
        <Button variant="dark" onClick={() => navigate("/")}>Torna alla Home</Button>
        <Button variant="primary" onClick={() => navigate("/games")}>Nuovo Gioco</Button>
      </div>
    </div>
  );
}

export default GameSummary;