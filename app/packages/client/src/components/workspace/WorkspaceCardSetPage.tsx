import {useActions, useAppState} from "../../overmind";
import {Button, Container} from "react-bootstrap";
import React from "react";
import CardList from "../cards/CardList";

function WorkspaceCardSetPage() {
    const state = useAppState();
    const actions = useActions();

    if (state.workspace.workspace === null) {
        if (state.workspaces.loading) {
            return <Container className="my-5">Loading...</Container>;
        } else {
            return <Container className="my-5">Workspace not found.</Container>
        }
    }
    if (state.workspaceCardSet.cardSet === null) {
        if (state.workspace.cardSetsLoading) {
            return <Container className="my-5">Loading...</Container>;
        } else {
            return <Container className="my-5">Card set not found.</Container>
        }
    }

    return <Container>
        <h1 className="my-5">Card set <i>{state.workspaceCardSet.cardSet?.name ?? 'unknown'}</i> in workspace <i>{state.workspace.workspace.name}</i></h1>
        {state.workspaceCardSet.cardsLoading ? <div>Loading cards...</div> : <CardList cardBeingDeleted={state.workspaceCardSet.cardBeingDeleted} onDeleteCard={card => actions.workspaceCardSet.deleteCardStart(card)} cards={state.workspaceCardSet.cards}/>}
        <Button className="mt-5" onClick={() => actions.createCardModal.openCreateCardModal(state.workspaceCardSet.cardSetId!)}>+ Create card</Button>
    </Container>;
}

export default WorkspaceCardSetPage;