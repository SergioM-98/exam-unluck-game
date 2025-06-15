import { Row, Col, Container } from "react-bootstrap";
import {useEffect} from 'react';
import { Link } from "react-router";

function HomePage (props) {
  
  useEffect(() => {
    props.setState(1);
  }, []);
  
  return(
    <>
    <Container className="screen text-center mt-5">
      <Row>
        <Col>
        <h1 className="title">Benvenuti nella HomePage Stuff Happens</h1>
        <h2 className="subtitle">Romantic Edition</h2>
        <div className="btn-home">
          <Link className='btn btn-dark' to="/howToPlay">GUIDA RAPIDA</Link> 
          {props.loggedIn ? <Link className='btn btn-dark' to={`/games/round${props.stato}`}>GIOCA ORA</Link>  :  <Link className='btn btn-dark ' to="/games">GIOCA ORA</Link> }
        </div> 
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default HomePage;