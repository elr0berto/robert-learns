import React from 'react';
import {useAppState} from "./overmind";
import {LoginStatus} from "./overmind/login/login-state";
import {Container, Nav, Navbar} from "react-bootstrap";
import {pageUrls} from "./page-urls";

function App() {
    const state = useAppState();

    if (state.login.status === LoginStatus.Checking) {
        return <div>Loading...</div>;
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Robert Learns</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {state.login.user!.isGuest ? <Nav.Link href={pageUrls.signIn.url()}>Sign in</Nav.Link> : null}
                        {state.login.user!.isGuest ? <Nav.Link href={pageUrls.signUp.url()}>Sign up</Nav.Link> : null}
                        {state.login.user!.isGuest ? null : <Nav.Link>Sign out</Nav.Link>}
                    </Nav>
                    <Nav>Signed in as {state.login.user!.isGuest ? 'guest' : state.login.user!.username}</Nav>
                    <Nav>Current Page {state.page.current}</Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
  );
}

export default App;
