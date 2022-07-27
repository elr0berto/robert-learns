import React, { useState } from 'react';
import {useAppState} from "./overmind";
import {LoginStatus} from "./overmind/login/login-state";
import {Container, Nav, Navbar} from "react-bootstrap";

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
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                    </Nav>
                    <Nav>Logged in as {state.login.user!.firstName}</Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
  );
}

export default App;
