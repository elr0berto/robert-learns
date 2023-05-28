import {useActions, useAppState} from "../../overmind";
import {Button, Container} from "react-bootstrap";
import React from "react";
import CardList from "../cards/CardList";
import DeleteCardModal from "../cards/DeleteCardModal";
import {pageUrls} from "../../page-urls";
import AddCardsFromOtherCardSetsModal from "../cards/AddCardsFromOtherCardSetsModal";
import EditCardCardSetsModal from "../cards/EditCardCardSetsModal";

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
        <h1 className="my-5">Card set <i>{state.workspaceCardSet.cardSet?.name ?? 'unknown'}</i> in workspace <i>{state.workspace.workspace.name}</i> {state.workspaceCardSet.currentUserCanEdit ? <Button href={pageUrls.workspaceCardSetEdit.url(state.workspace.workspace, state.workspaceCardSet.cardSet)}>Edit card set</Button> : null}</h1>
        {state.workspaceCardSet.cardsLoading ? <div>Loading cards...</div> : <CardList
            thisCardSetId={state.workspaceCardSet.cardSetId!}
            showActionButtons={state.workspace.currentUserCanContribute!}
            cardBeingDeleted={state.workspaceCardSet.cardBeingDeleted}
            onDeleteCard={card => actions.workspaceCardSet.deleteCardStart(card)}
            onEditCard={card => actions.createCardModal.openCreateCardModal({cardSetId: state.workspaceCardSet.cardSetId!, card: card})}
            onEditCardCardSets={card => actions.editCardCardSetsModal.open(card.id)}
            cards={state.workspaceCardSet.cards}/>}

        {state.workspaceCardSet.currentUserCanCreateCards ? <Button className="mt-5" onClick={() => actions.createCardModal.openCreateCardModal({cardSetId: state.workspaceCardSet.cardSetId!, card: null})}>+ Create card</Button> : null}
        {state.workspaceCardSet.currentUserCanCreateCards ? <Button className="mt-5 ms-3" onClick={() => actions.addCardsFromOtherCardSetsModal.open(state.workspaceCardSet.cardSetId!)}>+ Add cards from other card sets</Button> : null}


        {state.workspaceCardSet.showConfirmDeleteModal ? <DeleteCardModal
            cardSet={state.workspaceCardSet.cardSet}
            onClose={() => actions.workspaceCardSet.deleteCardCancel()}
            onConfirm={() => actions.workspaceCardSet.deleteCardConfirm()}
            confirming={state.workspaceCardSet.confirmingDeleteCard}
            cardBeingDeletedExistsInOtherCardSets={state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets!}
            card={state.workspaceCardSet.cardBeingDeleted!}/> : null}
        <AddCardsFromOtherCardSetsModal/>
        <EditCardCardSetsModal/>
    </Container>;
}

export default WorkspaceCardSetPage;