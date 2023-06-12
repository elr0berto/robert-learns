import {/*useActions,*/ useAppState} from "../../overmind";
import {Button, Container} from "react-bootstrap";
import React from "react";
import {pageUrls} from "../../page-urls";

function WorkspacePage() {
    const state = useAppState();
    //const actions = useActions();

    if (state.page.workspace === null) {
        if (state.page.loadingWorkspaces) {
            return <Container>Loading...</Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }
    return <Container>
        <h1 className="my-5">Workspace {state.page.workspace.name}</h1>
        {state.permission.editWorkspace ? <Button href={pageUrls.workspaceEdit.url(state.page.workspace)}>Edit workspace</Button> : null}
    </Container>;
}

export default WorkspacePage;