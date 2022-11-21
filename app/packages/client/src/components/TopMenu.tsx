import React from 'react';
import {useActions, useAppState} from "../overmind";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {SignInStatus} from "../overmind/sign-in/sign-in-state";
import {Pages, pageUrls} from "../page-urls";

function TopMenu() {
    const state = useAppState();
    const actions = useActions();

    return <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/">Robert Learns</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {state.signIn.user!.isGuest ? <Nav.Link href={pageUrls.signIn.url()}>Sign in</Nav.Link> : null}
                    {state.signIn.user!.isGuest ? <Nav.Link href={pageUrls.signUp.url()}>Sign up</Nav.Link> : null}
                    <NavDropdown title={state.workspace.workspace === null ? 'Workspaces' : ('Workspace ' + state.workspace.workspace.name)}>
                        {state.workspaces.loading ? <>
                            <NavDropdown.Item key="loading">Loading...</NavDropdown.Item>
                            <NavDropdown.Divider/>
                        </> : <>
                            {state.workspaces.list.map(workspace => <NavDropdown.Item key={workspace.id} href={pageUrls.workspace.url(workspace)}>{workspace.name}</NavDropdown.Item>)}
                            {state.workspaces.list.length > 0 ? <NavDropdown.Divider/> : null}
                        </>}
                        <NavDropdown.Item href={pageUrls.workspaceCreate.url()}>Create workspace</NavDropdown.Item>
                    </NavDropdown>
                    {state.page.current === Pages.Workspace ||
                    state.page.current === Pages.WorkspaceCardSetCreate ||
                    state.page.current === Pages.WorkspaceCreate ||
                    state.page.current === Pages.WorkspaceCardSet ?
                        <NavDropdown title={state.workspace.cardSetsLoading ? 'Loading card sets...' : 'Card sets'}>
                            {state.workspace.cardSets.map(cardSet => <NavDropdown.Item key={cardSet.id} href={pageUrls.workspaceCardSet.url(state.workspace.workspace!, cardSet)}>{cardSet.name}</NavDropdown.Item>)}
                            {state.workspace.cardSets.length > 0 ? <NavDropdown.Divider/> : null}
                            <NavDropdown.Item href={pageUrls.workspaceCardSetCreate.url(state.workspace.workspace!)}>Create card set</NavDropdown.Item>
                        </NavDropdown> : null
                    }

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
    </Navbar>;
}

export default TopMenu;