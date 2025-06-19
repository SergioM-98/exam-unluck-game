import { Card } from 'react-bootstrap';

function GameCard(props) {
  const URL = "http://localhost:3001";
  return (
    <Card
      className="text-center h-100"
      style={{
        width: "240px",
        maxWidth: "240px",
        minWidth: "120px",
        height: "310px",
        maxHeight: "290px",
        minHeight: "290px",
        margin: "0 6px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "3px solid #b30059",
        boxShadow: "0 0 8px #b3005933"
      }}
    >
      <Card.Body className="d-flex flex-column justify-content-between h-100 p-2">
        <Card.Title style={{ fontSize: "1rem", whiteSpace: "normal", wordBreak: "break-word"}} title={props.name}>{props.name}</Card.Title>
        <Card.Img variant="top" src={URL + `${props.image}`} style={{ maxHeight: "100px", objectFit: "scale-down", width: "100%", margin: "0 auto" }} />
        <Card.Text className="mt-2" style={{ fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "visible", textOverflow: "ellipsis" }}>{props.index}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default GameCard;