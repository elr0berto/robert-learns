import React from 'react';
import {useActions, useAppState} from "./overmind";
import {SignInStatus} from "./overmind/sign-in/sign-in-state";
import {Col, Container, Nav, Navbar, NavDropdown, Row, Spinner} from "react-bootstrap";
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
                        <NavDropdown title="Workspaces">
                            <NavDropdown.Item href={pageUrls.workspaceCreate.url()}>Create workspace</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            {state.workspaces.loading ? 'Loading...' : <>
                                {state.workspaces.list.map(workspace => <NavDropdown.Item href={pageUrls.workspace.url(workspace)}>{workspace.name}</NavDropdown.Item>)}
                            </>}
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        {state.signIn.status === SignInStatus.SigningOut ? 'Signing out...' : state.signIn.user!.isGuest ?
                            'Signed in as guest' :
                            <NavDropdown title={'Signed in as ' + state.signIn.user!.username}>
                                <NavDropdown.Item onClick={() => actions.signIn.signOut()}>Sign out</NavDropdown.Item>
                            </NavDropdown>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <MainContent/>
    </>;
}

export default AppInner;