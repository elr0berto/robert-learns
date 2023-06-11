import {/*useActions,*/ useAppState} from "../../overmind";
import {Button, Container} from "react-bootstrap";
import React from "react";
import {pageUrls} from "../../page-urls";

function WorkspacePage() {
    const state = useAppState();
    //const actions = useActions();

    if (state.nav.workspace === null) {
        if (state.nav.loadingWorkspaces) {
            return <Container>Loading...</Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }
    return <Container>
        <h1 className="my-5">Workspace {state.nav.workspace.name}</h1>
        {state.permission.currentUserCanEditCurrentWorkspace ? <Button href={pageUrls.workspaceEdit.url(state.nav.workspace)}>Edit workspace</Button> : null}
    </Container>;
}

export default WorkspacePage;