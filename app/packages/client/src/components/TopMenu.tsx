import React from 'react';
import {useActions, useAppState} from "../overmind";
import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {SignInStatus} from "../overmind/sign-in/sign-in-state";
import {Pages, pageUrls} from "../page-urls";

function TopMenu() {
    const state = useAppState();
    const actions = useActions();

    const workspace = state.page.workspace;

    console.log('TopMenu page: ' + state.page.page);
    console.log('TopMenu state.page.workspace', state.page.workspace);
    return <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/">Robert Learns</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {state.signIn.user === null ? <Nav.Link href={pageUrls.signIn.url()}>Sign in</Nav.Link> : null}
                    {state.signIn.user === null ? <Nav.Link href={pageUrls.signUp.url()}>Sign up</Nav.Link> : null}
                    <NavDropdown title={state.page.workspace === null ? 'Workspaces' : ('Workspace ' + state.page.workspace.name)}>
                        {state.page.loadingWorkspaces ? <>
                            <NavDropdown.Item key="loading">Loading...</NavDropdown.Item>
                            <NavDropdown.Divider/>
                        </> : <>
                            {state.page.workspaces.map(workspace => <NavDropdown.Item key={workspace.id} href={pageUrls.workspace.url(workspace)}>{workspace.name}</NavDropdown.Item>)}
                            {state.page.workspaces.length > 0 ? <NavDropdown.Divider/> : null}
                        </>}
                        <NavDropdown.Item href={pageUrls.workspaceCreate.url()}>Create workspace</NavDropdown.Item>
                    </NavDropdown>
                    {
                        (
                        state.page.page === Pages.Workspace ||
                        state.page.page === Pages.WorkspaceCardSetCreate ||
                        state.page.page === Pages.WorkspaceCardSetEdit ||
                        state.page.page === Pages.WorkspaceCardSet) ?
                        <NavDropdown title={
                                state.page.cardSet !== null ?
                                state.page.cardSet.name :
                                (state.page.loadingCardSets ? 'Loading card sets...' : ('Card sets ('+ state.page.cardSets.length +')' ))}>
                            {workspace !== null ? state.page.cardSets.map(cardSet => <NavDropdown.Item key={cardSet.id} href={pageUrls.workspaceCardSet.url(workspace, cardSet)}>{cardSet.name}</NavDropdown.Item>) : null}
                            {state.page.cardSets.length > 0 ? <NavDropdown.Divider/> : null}
                            {workspace !== null ? <NavDropdown.Item href={pageUrls.workspaceCardSetCreate.url(workspace)}>Create card set</NavDropdown.Item> : null}
                        </NavDropdown> : null
                    }
                    <Button className="mx-lg-5" variant="success" href={pageUrls.drill.url()}>Drill</Button>
                </Nav>
                <Nav>
                    {
                        state.signIn.status === SignInStatus.SigningOut ?
                        'Signing out...' :
                        (
                            state.signIn.user === null ?
                            'Signed in as guest' :
                            <NavDropdown title={'Signed in as ' + state.signIn.user.username}>
                                {state.signIn.user.admin ? <NavDropdown.Item href={pageUrls.adminLogs.url()}>Logs</NavDropdown.Item> :null}
                                <NavDropdown.Item onClick={() => actions.signIn.signOut()}>Sign out</NavDropdown.Item>
                            </NavDropdown>
                        )
                    }
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
}

export default TopMenu;