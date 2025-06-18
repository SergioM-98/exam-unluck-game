import { useState, useRef } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import GameCard from "./GameCard.jsx";
import dayjs from "dayjs";
import API from "../API/API.mjs";
import { Round } from "../models/GameModels.mjs";
import { useNavigate } from "react-router";
import Timer from "./Timer.jsx";

function GameManager(props) {
  const { gameData, user, setMessage } = props;
  const [cardsDrawn, setCardsDrawn] = useState(gameData?.cardsDrawn || []);
  const [cardsInHand, setCardsInHand] = useState(gameData?.cardsInHand || []);
  const [cardOfRound, setCardOfRound] = useState(gameData?.cardOfRound || null);
  const [currentRound, setCurrentRound] = useState(gameData?.currentRound || null);
  const [rounds, setRounds] = useState(gameData?.rounds || []);
  const [inGame, setInGame] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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
      await API.saveTimer(roundNumber, startRound);
      setInGame(true);
      setTimerKey((k) => k + 1);
    } catch (error) {
      setMessage && setMessage({ msg: "Error starting round", type: "danger" });
    }
  };
  const endGame = async (finalrounds, updatedCardsInHand) => {
    setLoading(true);
    const totalWon = finalrounds.reduce((acc, round) => acc + (round.won ? 1 : 0), 0);
    if (props.loggedIn) {
      try {
        const game = await API.saveGame({
          userId: user.id,
          date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
          totalWon: totalWon,
        });
        const roundsId = await API.saveRounds(game.gameId, finalrounds);
        await API.updateGameRounds(game.gameId, roundsId);
      } catch (error) {
        setMessage && setMessage({ msg: "Error saving game", type: "danger" });
      }
    }
    setTimeout(() => {
      setLoading(false);
      navigate("/games/summary", { state: { cardsInHand: updatedCardsInHand } });
    }, 1000);
  };

  const handleEndRound = async (won, card) => {
    let updatedCardsInHand = cardsInHand;
    if (won) {
      const result = await API.validateTimer(currentRound.roundNumber);
      if (!result.valid) {
        won = false;
      } else {
        updatedCardsInHand = [...cardsInHand, card].sort((a, b) => a.index - b.index);
        setCardsInHand(updatedCardsInHand);
      }
    }
    const updateRound = { ...currentRound, won };
    setCurrentRound(updateRound);
    const updatedRounds = [...rounds, updateRound];
    setRounds(updatedRounds);
    setInGame(false);
    if ((cardsDrawn.length === 8 || updatedCardsInHand.length === 6) || (!props.loggedIn)) {
      await endGame(updatedRounds, updatedCardsInHand);
    }
  };

  const selectionControl = async (precIndex, succIndex) => {
    let won = false;
    const card = await API.getCardById(currentRound.roundNumber, cardOfRound.cardId);
    setCurrentRound((curr) => ({ ...curr, cardId: card.cardId }));
    if (card.index < succIndex && card.index > precIndex) {
      won = true;
    }
    await handleEndRound(won, card);
  };

  return (
    <Container fluid className="main-content" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", padding: 0 }}>
      {loading ? (
        <Row className="justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <Col xs="auto" className="text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: "5rem", height: "5rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="mt-4">
              <span style={{ fontSize: "2.2rem", fontWeight: "bold" }}>
                Loading summary data...
              </span>
            </div>
          </Col>
        </Row>
      ) : inGame ? (
        <div className="main-content d-flex flex-column justify-content-between align-items-center" style={{ flex: 1, width: "100%" }}>
          <div className="w-100 position-relative" style={{ minHeight: "1vh" }}>
            <Row className="text-center w-100">
              <Col>
                <h1>Round: {currentRound?.roundNumber || "-"}</h1>
              </Col>
            </Row>
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: "16px",
              zIndex: 10
            }}>
              <Timer
                key={timerKey}
                seconds={30}
                onTimeout={() => {
                  setInGame(false);
                  handleEndRound(false, cardOfRound);
                }}
              />
            </div>
          </div>


          <div className="w-100 d-flex justify-content-center align-items-center" style={{ flex: 1, minHeight: "10vh" }}>
            {cardOfRound && (
              <GameCard {...cardOfRound} />
            )}
          </div>

          <div className="w-100 d-flex flex-column align-items-center justify-content-end" style={{ minHeight: "20vh" }}>
            <div className="d-flex align-items-center flex-nowrap mb-3 cards-row" style={{ width: "100%", maxWidth: "100vw", justifyContent: "flex-start", overflowX: "auto", whiteSpace: "nowrap", gap: "0", paddingLeft: "24px", paddingRight: "24px" }}>
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
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ flex: 1, minHeight: "100vh" }}>
          <Button
            variant="btn btn-dark mb-2"
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