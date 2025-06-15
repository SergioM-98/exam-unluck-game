import {Navbar, Container, Nav} from 'react-bootstrap';
import { LogoutButton } from './AuthComponents';
import {Link} from 'react-router';

function NavHeader(props) {
    
    
    return (
       <Navbar style={{ backgroundColor: '#ad1457' }} variant="dark" fixed="top" expand="lg">
            <Container fluid>
              <Navbar.Brand
                    as={Link}
                    to="/"
                   
                >
                    Stuff Happens:{" "}
                    <span
                        className="text-shadow-black"
                        style={{ color: '#b30000' }}
                    
                    >
                        Romantic
                    </span>{" "}
                    edition
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">    
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/" >Home</Nav.Link>
                        {props.loggedIn  ?(
                            <>
                                <Nav.Link as={Link} to={`/profile/${props.user.id}`}>Profile</Nav.Link>
                                <LogoutButton logout={props.handleLogout} />
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}

                    </Nav>         
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavHeader;