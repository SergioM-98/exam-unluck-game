import { Row, Col, Container, Button } from "react-bootstrap";
import { useEffect } from 'react';
import { Link, useNavigate } from "react-router";

function HomePage (props) {
  const navigate = useNavigate();

  useEffect(() => {
    props.setState(1);
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
        paddingTop: "80px", // spazio per non coprire la navbar
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Row>
        <Col className="text-center">
          <h1 className="title" style={{ marginBottom: "0.5rem" }}>
            Welcome to the Stuff Happens HomePage
          </h1>
          <h2 className="subtitle" style={{ marginBottom: "2.5rem" }}>
            Romantic Edition
          </h2>
        </Col>
      </Row>
      <Row className="flex-grow-1 justify-content-center align-items-center">
        <Col xs={12} className="d-flex flex-column align-items-center">
          <Link
            className="btn btn-dark mb-4"
            to="/howToPlay"
            style={{ fontSize: "1.5rem", padding: "16px 40px", minWidth: "275px" }}
          >
            QUICK GUIDE
          </Link>
          {props.loggedIn ? (
            <Button
              variant="dark"
              className="mb-2"
              style={{ fontSize: "1.5rem", padding: "16px 40px", minWidth: "220px", maxWidth: "300px" }}
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