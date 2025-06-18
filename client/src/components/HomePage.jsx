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

  return(
    <Container className="screen text-center mt-5">
      <Row>
        <Col>
          <h1 className="title">Welcome to the Stuff Happens HomePage</h1>
          <h2 className="subtitle">Romantic Edition</h2>
          <div className="btn-home d-flex flex-column align-items-center">
            <Link className='btn btn-dark mb-2' to="/howToPlay">QUICK GUIDE</Link> 
            {props.loggedIn
              ? <Button variant="dark" className="mb-2" onClick={handlePlay}>
                  PLAY NOW
                </Button>
              : <Button variant="dark" className="mb-2" onClick={handlePlay}>
                  PLAY DEMO NOW
                </Button>
            }
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;