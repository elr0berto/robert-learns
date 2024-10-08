import React from 'react';
import {useActions, useAppState} from "../overmind";
import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {SignInStatus} from "../overmind/sign-in/sign-in-state";
import {Pages, pageUrls} from "../page-urls";
import {RL_SHARED_VERSION} from "@elr0berto/robert-learns-shared/dist/version";
import {CollectionPlayFill, FolderPlus} from "react-bootstrap-icons";
import {CardSetWithChildrenAndCardCounts} from "../overmind/data/data-state";
import {Workspace} from "@elr0berto/robert-learns-shared/dist/api/models";


const renderCardSets = (cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[], workspace: Workspace) => {
    return cardSetsWithChildrenAndCardCounts.map(cardSetWithChildrenAndCardCounts => {
        if (cardSetWithChildrenAndCardCounts.children.length > 0) {
            return (
                <NavDropdown
                    title={cardSetWithChildrenAndCardCounts.cardSet.name + ' (' + cardSetWithChildrenAndCardCounts.cardCount + ')'}
                    id={`dropdown-submenu-${cardSetWithChildrenAndCardCounts.cardSet.id}`}
                    key={cardSetWithChildrenAndCardCounts.cardSet.id}
                >
                    <NavDropdown.Item
                        key={`parent-${cardSetWithChildrenAndCardCounts.cardSet.id}`}
                        href={pageUrls.workspaceCardSet.url(workspace, cardSetWithChildrenAndCardCounts.cardSet)}
                    >
                        {cardSetWithChildrenAndCardCounts.cardSet.name} ({cardSetWithChildrenAndCardCounts.cardCount})
                    </NavDropdown.Item>
                    <NavDropdown.Divider/>
                    {renderCardSets(cardSetWithChildrenAndCardCounts.children, workspace)}
                </NavDropdown>
            );
        } else {
            return (
                <NavDropdown.Item
                    key={cardSetWithChildrenAndCardCounts.cardSet.id}
                    href={pageUrls.workspaceCardSet.url(workspace, cardSetWithChildrenAndCardCounts.cardSet)}
                >
                    {cardSetWithChildrenAndCardCounts.cardSet.name} ({cardSetWithChildrenAndCardCounts.cardCount})
                </NavDropdown.Item>
            );
        }
    });
};

function TopMenu() {
    const state = useAppState();
    const actions = useActions();

    const workspace = state.page.workspace;

    return <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand title={'client: '+process.env.REACT_APP_VERSION + ' client-shared: ' + RL_SHARED_VERSION + ' server: ' + (state.version.version ?? 'unk') + ' server-shared: ' + (state.version.versionShared ?? 'unk')} href="/">
                <img
                    src="/favicon-32x32.png" // Update this path to your actual file path
                    className="d-inline-block align-top"
                    alt="Robert Learns"
                />
                {' '}
                Robert Learns
            </Navbar.Brand>
            <Button variant="success" href={pageUrls.drill.url()}><CollectionPlayFill/> Drill</Button>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavDropdown title={state.page.workspace === null ? 'Workspaces' : ('Workspace ' + state.page.workspace.name)}>
                        {state.page.loadingWorkspaces ? <>
                            <NavDropdown.Item key="loading">Loading...</NavDropdown.Item>
                            <NavDropdown.Divider/>
                        </> : <>
                            {state.page.workspaces.map(workspace => <NavDropdown.Item key={workspace.id} href={pageUrls.workspace.url(workspace)}>{workspace.name}</NavDropdown.Item>)}
                            {state.page.workspaces.length > 0 ? <NavDropdown.Divider/> : null}
                        </>}
                        <NavDropdown.Item as="div"><Button href={pageUrls.workspaceCreate.url()}><FolderPlus/> Create workspace</Button></NavDropdown.Item>
                    </NavDropdown>
                    {
                        (
                        state.page.page === Pages.Workspace ||
                        state.page.page === Pages.WorkspaceCardSetCreate ||
                        state.page.page === Pages.WorkspaceCardSetEdit ||
                        state.page.page === Pages.WorkspaceCardSet) ?
                        <NavDropdown className="recursive-nav-dropdown" title={
                                state.page.cardSet !== null ?
                                state.page.cardSet.name :
                                (state.page.loadingCardSets ? 'Loading card sets...' : ('Card sets'))}>
                            {workspace !== null
                                ? renderCardSets(state.page.cardSetsWithChildrenAndCardCounts, workspace)
                                : null}
                            {state.page.cardSets.length > 0 ? <NavDropdown.Divider/> : null}
                            {workspace !== null ? <NavDropdown.Item as="div"><Button href={pageUrls.workspaceCardSetCreate.url(workspace)}><FolderPlus/> Create card set</Button></NavDropdown.Item> : null}
                        </NavDropdown> : null
                    }
                </Nav>
                <Nav>
                    {state.signIn.user === null ? <Nav.Link href={pageUrls.signIn.url()}>Sign in</Nav.Link> : null}
                    {state.signIn.user === null ? <Nav.Link href={pageUrls.signUp.url()}>Sign up</Nav.Link> : null}
                    {
                        state.signIn.status === SignInStatus.SigningOut ?
                            <Navbar.Text>Signing out...</Navbar.Text> :
                        (
                            state.signIn.user === null ?
                            null :
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