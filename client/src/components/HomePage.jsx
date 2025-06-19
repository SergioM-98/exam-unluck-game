import { Row, Col, Container, Button, Alert } from "react-bootstrap";
import { useEffect } from 'react';
import { Link, useNavigate } from "react-router";

function HomePage (props) {
  const navigate = useNavigate();

  useEffect(() => {
    props.setHideLinks(false);
  }, []);

  const handlePlay = async () => {
    props.setHideLinks(true);
    if (props.onStartGame) await props.onStartGame();
    navigate("/games");
  };

  return (
    <Container
      fluid
      className="screen"
      style={{
        minHeight: "100vh",
        paddingTop: "60px", 
        display: "flex",
        flexDirection: "column"
      }}
    >
      {props.message && (
        <Row>
          <Col>
            <Alert
              variant={props.message.type}
              onClose={() => props.setMessage('')}
              dismissible
              className="mt-2"
            >
              {props.message.msg}
            </Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col className="text-center">
          <h1 className="title" style={{ marginBottom: "0.5rem" }}>
            Welcome to the Stuff Happens HomePage
          </h1>
          <h2 className="subtitle" style={{ marginBottom: "2.5rem" }}>
            <span
              style={{
                color: "#b30000",
                textShadow: "2px 2px 4px #000" 
              }}
              className="text-shadow-black"
            >
              Romantic
            </span>{" "}
            Edition
          </h2>
        </Col>
      </Row>
      <Row className="flex-grow-1 justify-content-center align-items-center">
        <Col xs={12} className="d-flex flex-column align-items-center">
          <Link
            className="btn btn-dark mb-4"
            to="/HowToPlay"
            style={{ fontSize: "1.5rem", padding: "16px 40px", minWidth: "275px" }}
          >
            QUICK GUIDE
          </Link>
          {props.loggedIn ? (
            <Button
              variant="dark"
              className="mb-2"
              style={{ fontSize: "1.5rem", padding: "16px 40px", minWidth: "275px", maxWidth: "300px" }}
              onClick={handlePlay}
            >
              PLAY NOW
            </Button>
          ) : (
            <Button
              variant="dark"
              className="mb-2"
              style={{ fontSize: "1.5rem", padding: "16px 40px", minWidth: "220px", maxWidth: "300px" }}
              onClick={handlePlay}
            >
              PLAY DEMO NOW
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;