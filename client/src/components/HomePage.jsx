import { Row, Col, Container } from "react-bootstrap";
import { useEffect } from 'react';
import { Link } from "react-router";

function HomePage (props) {
  useEffect(() => {
    props.setState(1);
  }, []);

  return(
    <Container className="screen text-center mt-5">
      <Row>
        <Col>
          <h1 className="title">Benvenuti nella HomePage Stuff Happens</h1>
          <h2 className="subtitle">Romantic Edition</h2>
          <div className="btn-home d-flex flex-column align-items-center">
            <Link className='btn btn-dark mb-2' to="/howToPlay">GUIDA RAPIDA</Link> 
            {props.loggedIn
              ? <Link className='btn btn-dark mb-2' to={`/games/round${props.stato}`} onClick={() => props.setHideLinks(true)}>GIOCA ORA</Link>
              : <Link className='btn btn-dark mb-2' to="/games" onClick={() => props.setHideLinks(true)}>GIOCA ORA DEMO</Link>
            }
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;