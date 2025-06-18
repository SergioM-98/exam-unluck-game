import { Row, Col } from "react-bootstrap";

function NotFound() {
  return (
    <Row className="justify-content-center mt-5">
      <Col className="fs-1">
      This route doesn't exist, tragic!
      </Col>
    </Row>
  );
}

export default NotFound;