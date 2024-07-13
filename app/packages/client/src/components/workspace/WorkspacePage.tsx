import {useActions, useAppState} from "../../overmind";
import { Button, Container } from "react-bootstrap";
import React from "react";
import { pageUrls } from "../../page-urls";
import {
    PencilSquare,
    ArrowLeftRight, FolderPlus,
} from "react-bootstrap-icons";
import Loading from "../Loading";
import CardSetTree from "./CardSetTree";

function WorkspacePage() {
    const state = useAppState();
    const actions = useActions();

    if (state.page.workspace === null) {
        if (state.page.loadingWorkspaces) {
            return <Container><Loading /></Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }
    return (
        <Container className="mb-5">
            <h1 className="my-5">Workspace {state.page.workspace.name}</h1>
            <div className="buttons mb-3">
                {state.permission.editWorkspace ?
                    <Button
                        href={pageUrls.workspaceEdit.url(state.page.workspace)}
                        className={"me-2"}
                        variant="outline-primary"
                    >
                        <PencilSquare/> Edit workspace
                    </Button> : null}
                {state.permission.createCardSet ?
                    <Button
                        href={pageUrls.workspaceCardSetCreate.url(state.page.workspace)}
                        className={"me-2"}
                        variant="outline-primary"
                    >
                        <FolderPlus/> Create card set
                    </Button> : null}
                {state.permission.editWorkspace && state.page.cardSetsWithChildren.length > 0 ?
                    <Button
                        onClick={actions.workspacePage.sortCardSets}
                        variant="outline-primary"
                    >
                        <ArrowLeftRight/> Sort card sets
                    </Button> : null}
            </div>
            {state.page.loadingCardSets ?
                <p>Loading card sets...</p> :
                <div className="workspace-card-sets">
                    <CardSetTree cardSetsWithChildren={state.workspacePage.cardSetsWithChildren} level={0} defaultOpen={false}/>
                </div>
            }

            {state.workspacePage.sorting ?
                <>
                    <Button className="mb-5" variant="outline-success" onClick={() => actions.workspacePage.sortCardSetsSave()}>Save sort order</Button>
                    <Button className={"mb-5 ms-3"} variant="outline-danger" onClick={() => actions.workspacePage.sortCardSetsCancel()}>Cancel</Button>
                </> :
                null}
        </Container>
    );
}

export default WorkspacePage;
