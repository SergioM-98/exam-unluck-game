import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";

function HowToPlay() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
      <Row className="justify-content-center mb-4">
        <Col className="text-center">
          <h1>How to play</h1>
          <Row className="fs-4 mt-4">
            <Col>
              <div>
                At the start of the game, you will draw 3 unlucky situation cards (all the situation cards of the game will have a romantic relationship theme), and you will be given the unluckiness indexes of these cards (from 1 to 100).
              </div>
            </Col>
          </Row>
          <Row className="fs-4 mt-4">
            <Col>
              <div>
                Each round you will draw a card without an unluckiness index and you will have to try to guess where it fits among the cards in your hand.
              </div>
            </Col>
          </Row>
          <Row className="fs-4 mt-4">
            <Col>
              <div>
                If you guess correctly, the card is added to your hand, otherwise it is discarded.
              </div>
            </Col>
          </Row>
          <Row className="fs-4 mt-4">
            <Col>
              <div>
                The game ends when you have collected 6 cards in your hand or after 5 rounds.
              </div>
            </Col>
          </Row>
          <Row className="fs-4 mt-4">
            <Col>
              <div>
                If you have collected 6 cards in your hand, you <strong>win!</strong> Otherwise, if the game ends without you having collected 6 cards, you lose.
              </div>
            </Col>
          </Row>
          <Row className="fs-4 mt-4">
            <Col>
              <div>
                Be careful, you only have 30 seconds or the round will be considered lost card!
              </div>
            </Col>
          </Row>
          <Row className="fs-4 mt-4">
            <Col>
              <strong>For non-logged-in users, the game will be a demo that ends after one round!</strong>
            </Col>
          </Row>
        </Col>
      </Row>
      <Button variant="btn btn-dark mb-2 btn-lg" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </Container>
  );
}

export default HowToPlay;