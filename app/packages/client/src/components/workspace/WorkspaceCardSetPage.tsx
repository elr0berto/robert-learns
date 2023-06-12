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

    if (state.page.workspace === null) {
        if (state.page.loadingWorkspaces) {
            return <Container className="my-5">Loading...</Container>;
        } else {
            return <Container className="my-5">Workspace not found.</Container>
        }
    }
    if (state.page.cardSet === null) {
        if (state.page.loadingCardSets) {
            return <Container className="my-5">Loading...</Container>;
        } else {
            return <Container className="my-5">Card set not found.</Container>
        }
    }

    return <Container>
        <h1 className="my-5">
            Card set <i>{state.page.cardSet.name}</i> in workspace <i>{state.page.workspace.name}</i>
            {state.permission.editCardSet ? <Button href={pageUrls.workspaceCardSetEdit.url(state.page.workspace, state.page.cardSet)}>Edit card set</Button> : null}
        </h1>
        {state.page.loadingCards ? <div>Loading cards...</div> : <CardList
            thisCardSetId={state.page.cardSet.id}
            showActionButtons={state.permission.editCardSet}
            cardBeingDeleted={state.workspaceCardSet.cardWithCardSetsBeingDeleted?.card ?? null}
            onDeleteCard={card => actions.workspaceCardSet.deleteCardStart(card)}
            onEditCard={card => actions.createCardModal.openCreateCardModal({cardSetId: state.page.cardSet!.id, card: card})}
            onEditCardCardSets={card => actions.editCardCardSetsModal.open(card.id)}
            cardsWithCardSets={state.page.cardsWithCardSets}/>}

        {state.permission.createCard ? <Button className="mt-5" onClick={() => actions.createCardModal.openCreateCardModal({cardSetId: state.page.cardSet!.id, card: null})}>+ Create card</Button> : null}
        {state.permission.createCard ? <Button className="mt-5 ms-3" onClick={() => actions.addCardsFromOtherCardSetsModal.open(state.page.cardSet!.id!)}>+ Add cards from other card sets</Button> : null}

        {state.workspaceCardSet.showConfirmDeleteModal ? <DeleteCardModal
            cardSet={state.page.cardSet!}
            onClose={() => actions.workspaceCardSet.deleteCardCancel()}
            onConfirm={() => actions.workspaceCardSet.deleteCardConfirm()}
            confirming={state.workspaceCardSet.confirmingDeleteCard}
            cardBeingDeletedExistsInOtherCardSets={state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets!}
            cardWithCardSets={state.workspaceCardSet.cardWithCardSetsBeingDeleted!}/> : null}
        <AddCardsFromOtherCardSetsModal/>
        <EditCardCardSetsModal/>
    </Container>;
}

export default WorkspaceCardSetPage;