import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import { Routes, Route, Navigate, Outlet } from "react-router";
import { LoginForm } from "./components/AuthComponents";
import API from "./API/API.mjs";
import NavHeader from "./components/NavHeader";
import HomePage from "./components/HomePage";
import GameManager from "./components/GameManager";
import RoundManager from "./components/RoundManager";
import Profile from "./components/Profile";
import { Container, Row, Col, Alert } from "react-bootstrap";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [state, setState] = useState(1); 
  const [hideLinks, setHideLinks] = useState(false);


   useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
  };

  


  return (
    <Routes>
    <Route element={<>
      <NavHeader
        loggedIn={loggedIn}
        handleLogout={handleLogout}
        user={user}
        // Nascondi i link solo se sei in gioco
        hideLinks={hideLinks}
      />
      <Container fluid>
      {message && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row> }
        <Row>
          <Col>
            <Outlet />
          </Col>
        </Row>
      </Container>
      
    </>}>
    <Route path="/" element={ <HomePage loggedIn={loggedIn} user={user} state={state} setState={setState} setHideLinks={setHideLinks} />} />
    <Route path="/profile/:idProfile" element={<Profile user={user} loggedIn={loggedIn} />} />
    <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginForm handleLogin={handleLogin} />} />
    <Route path="/games" element={<GameManager LoggedIn = {loggedIn} user={user}/>} >
      <Route path="round:roundNumber" element={<RoundManager loggedIn={loggedIn}/>} />
      
    </Route>
      <Route path="/profile/:idProfile" element={<Profile user={user} loggedIn={loggedIn} />} />
      <Route path="*" element={<Navigate replace to="/" />} />
      
    </Route>
    </Routes>
  )
}

export default App
