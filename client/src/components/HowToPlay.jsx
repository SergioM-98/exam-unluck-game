import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router";

function HowToPlay() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <div className="text-center mb-4">
        <h1>How to play</h1>
        <br />
        <p className="fs-4">
          At the start of the game, you will draw 3 unlucky situation cards and you will be given the unluckiness indexes of these cards (from 1 to 100).<br />
          Each round you will draw a card without an unluckiness index and you will have to try to guess where it fits among the cards in your hand.<br />
        <br />
          If you guess correctly, the card is added to your hand, otherwise it is discarded.<br />
          The game ends when you have collected 6 cards in your hand or after 5 rounds.<br />
          If you have collected 6 cards in your hand, you <strong>win!</strong> Otherwise, if the game ends without you having collected 6 cards, you lose.<br />
          <br />
          Be careful, you only have 30 seconds or the round will be considered lost when you choose a card!<br />
        </p>
        <p className="fs-4">
          <strong>For non-logged-in users, the game ends after one round!</strong><br />
        </p>
      </div>
      <Button variant="btn btn-dark mb-2 btn-lg" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </Container>
  );
}

export default HowToPlay;