import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { Routes, Route, Navigate, Outlet } from "react-router";
import { LoginForm } from "./components/AuthComponents";
import API from "./API/API.mjs";
import NavHeader from "./components/NavHeader";
import HomePage from "./components/HomePage";
import GameManager from "./components/GameManager";
import GameSummary from "./components/GameSummary";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import HowToPlay from "./components/HowToPlay";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { Game, Round } from "./models/GameModels.mjs";
import dayjs from "dayjs";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [state, setState] = useState(1); 
  const [hideLinks, setHideLinks] = useState(false);
  const [gameData, setGameData] = useState(null);
  

   useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setUser(user);
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
  };

  const startGame = async (user) => {
    const startingFilters = { num: 3, visibility: true };
    const drawn = await API.getCards(0, startingFilters);
    drawn.sort((a, b) => a.index - b.index);

    // Pesca la carta del primo round
    const banned = drawn.map(card => card.cardId);
    const firstRoundCard = await API.getCards(1, { num: 1, bannedCards: banned, visibility: false });

    // Prepara il round corrente
    const startRound = dayjs().format("YYYY-MM-DD HH:mm:ss");
    
    const currentRound = new Round(
      null,
      startRound,
      firstRoundCard[0].cardId,
      1,
      false,
      null
    );

    setGameData({
      game: new Game(
        user._id,
        dayjs().format('YYYY-MM-DD HH:mm:ss'),
        drawn[0],
        drawn[1],
        drawn[2],
        null, null, null, null, null, null, 0
      ),
      cardsInHand: drawn,
      cardsDrawn: [...drawn, ...firstRoundCard],
      cardOfRound: firstRoundCard[0],
      currentRound
    });
    await API.saveTimer(1, startRound);
  };

  return (
    <Routes>
      <Route
        element={
          <>
            <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} user={user} hideLinks={hideLinks} />
            <Container fluid className="main-content">
              <Row>
                <Col>
                  <Outlet />
                </Col>
              </Row>
            </Container>
          </>
        }
      >
        <Route
          path="/"
          element={
            <HomePage
              loggedIn={loggedIn}
              user={user}
              state={state}
              setState={setState}
              setHideLinks={setHideLinks}
              onStartGame={() => startGame(user)}
              // Passa il messaggio solo a HomePage
              message={message}
              setMessage={setMessage}
            />
          }
        />
        <Route path="/games" element={<GameManager user={user} loggedIn={loggedIn} gameData={gameData} setMessage={setMessage} startingRounds={true} />} />
        <Route path="/games/summary" element={<GameSummary setHideLinks={setHideLinks} loggedIn={loggedIn} onStartGame={() => startGame(user)} />} />
        <Route path="/profile/:idProfile" element={<Profile user={user} loggedIn={loggedIn} />} />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate replace to="/" />
            ) : (
              <LoginForm handleLogin={handleLogin} />
            )
          }
        />
        <Route path="/HowToPlay" element={<HowToPlay />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
