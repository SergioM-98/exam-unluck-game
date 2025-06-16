import { useState, useRef } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import GameCard from "./GameCard.jsx";
import dayjs from "dayjs";
import API from "../API/API.mjs";
import { Round } from "../models/GameModels.mjs";

function GameManager(props) {
  const { gameData, user, setMessage } = props;
  const [cardsDrawn, setCardsDrawn] = useState(gameData?.cardsDrawn || []);
  const [cardsInHand, setCardsInHand] = useState(gameData?.cardsInHand || []);
  const [cardOfRound, setCardOfRound] = useState(gameData?.cardOfRound || null);
  const [currentRound, setCurrentRound] = useState(gameData?.currentRound || null);
  const [rounds, setRounds] = useState(gameData?.rounds || []);
  const [inGame, setInGame] = useState(true);

  // Avvia un nuovo round
  const handleRoundStart = async (roundNumber, drawnCards = cardsDrawn) => {
    try {
      const banned = drawnCards.map((card) => card.cardId);
      const roundCard = await API.getCards(roundNumber, {
        num: 1,
        bannedCards: banned,
        visibility: false,
      });
      setCardsDrawn(drawnCards.concat(roundCard));
      setCardOfRound(roundCard[0]);
      const startRound = dayjs().format("YYYY-MM-DD HH:mm:ss");
      const newRound = new Round(
        null,
        startRound,
        roundCard[0].cardId,
        roundNumber,
        false,
        null
      );
      setCurrentRound(newRound);
      setRounds((prev) => [...prev, newRound]);
      await API.saveTimer(roundNumber, startRound);
      setInGame(true);
      
    } catch (error) {
      setMessage && setMessage({ msg: "Error starting round", type: "danger" });
      
    }
  };

  // Gestisci la fine del round
  const handleEndRound = async (won) => {
    if (won) {
      const result = await API.validateTimer(currentRound.roundNumber);
      if (!result.valid) {
        won = false;
      } else {
        setCardsInHand((prev) => {
          const updated = [...prev, cardOfRound];
          updated.sort((a, b) => a.index - b.index);
          return updated;
        });
      }
    }
    setCurrentRound((curr) => ({ ...curr, won }));
    setRounds((prev) => [...prev, currentRound]);

    if (
      cardsDrawn.length === 8 ||
      cardsInHand.length === 6 ||
      props.loggedIn === false
    ) {
      // finisci il gioco
    }
    else {
        setInGame(false);
    }
  };

  const selectionControl = async (precIndex, succIndex) => {
    let won = false;
    const card = await API.getCardById(currentRound.roundNumber, cardOfRound.cardId);
    if (card.index < succIndex && card.index > precIndex) {
      won = true;
  
    }

    handleEndRound(won);
  };

  return (
    <Container fluid className="main-content" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: 0 }}>
      {inGame ? (
        <div className="main-content d-flex flex-column justify-content-between align-items-center" style={{ flex: 1, width: "100%" }}>
          {/* In alto */}
          <div className="w-100 d-flex justify-content-center" style={{ minHeight: "1vh" }}>
            <Row className="text-center w-100">
              <Col>
                <h1>Round: {currentRound?.roundNumber || "-"}</h1>
              </Col>
            </Row>
          </div>

          {/* Al centro */}
          <div className="w-100 d-flex justify-content-center align-items-center" style={{ flex: 1, minHeight: "10vh" }}>
            {cardOfRound && (
              <GameCard {...cardOfRound} />
            )}
          </div>

          {/* In basso */}
          <div className="w-100 d-flex flex-column align-items-center justify-content-end" style={{ minHeight: "20vh" }}>
            <div className="d-flex align-items-center flex-nowrap mb-3 cards-row" style={{ width: "100%", maxWidth: "100vw", justifyContent: "center", overflowX: "hidden", whiteSpace: "nowrap", gap: "0" }}>
              {Array.from({ length: cardsInHand.length + 1 }).map((_, idx) => (
                <span key={idx} className="d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    className="mx-1 between-btn"
                    style={{ minWidth: "36px", height: "36px", padding: 0, fontSize: "1.3rem" }}
                    onClick={() => {
                      const precIndex = idx === 0 ? 0 : (cardsInHand[idx - 1]?.index ?? 0);
                      const succIndex = idx === cardsInHand.length ? 101 : (cardsInHand[idx]?.index ?? 101);
                      selectionControl(precIndex, succIndex);
                    }}
                  >
                    ▼
                  </Button>
                  {idx < cardsInHand.length && <GameCard {...cardsInHand[idx]} />}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Mostra solo il bottone quando il round è finito
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ flex: 1, minHeight: "100vh" }}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleRoundStart((currentRound?.roundNumber || 0) + 1)}
          >
            Inizia prossimo Round
          </Button>
        </div>
      )}
    </Container>
  );
}

export default GameManager;