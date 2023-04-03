import {/*useActions,*/ useAppState} from "../../overmind";
import {Button, Container} from "react-bootstrap";
import React from "react";
import {pageUrls} from "../../page-urls";

function WorkspacePage() {
    const state = useAppState();
    //const actions = useActions();

    if (state.workspace.workspace === null) {
        if (state.workspaces.loading) {
            return <Container>Loading...</Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }
    return <Container>
        <h1 className="my-5">Workspace {state.workspace.workspace.name}</h1>
        {state.workspace.currentUserCanEdit ? <Button href={pageUrls.workspaceEdit.url(state.workspace.workspace)}>Edit workspace</Button> : null}
    </Container>;
}

export default WorkspacePage;