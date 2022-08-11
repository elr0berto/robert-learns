import React from 'react';
import {useActions, useAppState} from "./overmind";
import {SignInStatus} from "./overmind/sign-in/sign-in-state";
import {Col, Container, Nav, Navbar, Row, Spinner} from "react-bootstrap";
import {pageUrls} from "./page-urls";
import MainContent from "./components/MainContent";

function AppInner() {
    const state = useAppState();
    const actions = useActions();

    if (state.signIn.status === SignInStatus.Checking) {
        return <Container>
            <Row className="justify-content-md-center my-5">
                <Col className="col-md-auto">
                    <Spinner animation="grow"/>
                    <div>Loading...</div>
                </Col>
            </Row>
        </Container>;
    }

    return <>
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Robert Learns</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {state.signIn.user!.isGuest ? <Nav.Link href={pageUrls.signIn.url()}>Sign in</Nav.Link> : null}
                        {state.signIn.user!.isGuest ? <Nav.Link href={pageUrls.signUp.url()}>Sign up</Nav.Link> : null}
                        {state.signIn.user!.isGuest ? null : <Nav.Link onClick={() => actions.signIn.signOut()}>{state.signIn.status === SignInStatus.SigningOut ? 'Signing out...' : 'Sign out'}</Nav.Link>}
                    </Nav>
                    <Nav>Signed in as {state.signIn.user!.isGuest ? 'guest' : state.signIn.user!.username}</Nav>
                    <Nav>Current Page {state.page.current}</Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <MainContent/>
    </>;
}

export default AppInner;