import { useActionState } from "react";
import { Form, Button, Row, Col, Alert, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';

function LoginForm(props) {
    const [state, formAction, isPending] = useActionState(loginFunction, {username: '', password: ''});

    async function loginFunction(prevState, formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            await props.handleLogin(credentials);
            return { success: true };
        } catch (error) {
            return { error: 'Login failed. Check your credentials.' };
        }
    }

    return (
        <>
            { isPending && <Alert variant="warning">Please, wait for the server's response...</Alert> }
            <Row className="justify-content-center">
                <Col>
                    <Form action={formAction} style={{ fontSize: "1.3rem", padding: "32px", border: "none", boxShadow: "none" }}>
                        <Form.Group controlId='username' className='mb-4'>
                            <Form.Label style={{ fontSize: "2rem" }}>Username</Form.Label>
                            <Form.Control name='username' required style={{ fontSize: "1.2rem", padding: "12px" }} />
                        </Form.Group>

                        <Form.Group controlId='password' className='mb-4'>
                            <Form.Label style={{ fontSize: "2rem" }}>Password</Form.Label>
                            <Form.Control type='password' name='password' required minLength={6} style={{ fontSize: "1.2rem", padding: "12px" }} />
                        </Form.Group>

                        {state.error && <p className="text-danger">{state.error}</p>}

                        <div className="d-flex flex-column align-items-center">
                            <Button
                                variant="dark"
                                type='submit'
                                disabled={isPending}
                                style={{ fontSize: "2rem", padding: "10px 32px", width: "60%", marginBottom: "16px" }}
                            >
                                Login
                            </Button>
                            <Link
                                className='btn btn-danger'
                                to={'/'}
                                disabled={isPending}
                                style={{ fontSize: "2rem", padding: "10px 32px", width: "60%" }}
                            >
                                Cancel
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

function LogoutButton(props) {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await props.logout();
        navigate('/');
    };
    return (
        <Nav.Link as="button" onClick={handleLogout} type="button">
            Logout
        </Nav.Link>
    );
}

export { LoginForm, LogoutButton };