import {useActions, useAppState} from "../../overmind";
import {Button, Container} from "react-bootstrap";
import React from "react";
import CardList from "../cards/CardList";
import DeleteCardModal from "../cards/DeleteCardModal";
import {pageUrls} from "../../page-urls";
import AddCardsFromOtherCardSetsModal from "../cards/AddCardsFromOtherCardSetsModal";
import EditCardCardSetsModal from "../cards/EditCardCardSetsModal";
import {CardSet} from "@elr0berto/robert-learns-shared/dist/api/models";
import DeleteCardSetModal from "./DeleteCardSetModal";
import {ArrowLeftRight, DashCircle, PencilSquare} from "react-bootstrap-icons";

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

    const cardSet : CardSet = state.page.cardSet;

    return <Container className="mb-5">
        <h1 className="my-5">
            Card set <i>{state.page.cardSet.name}</i> in workspace <i>{state.page.workspace.name}</i>
        </h1>
        {state.page.loadingCards ?
            <div>Loading cards...</div> :
            <CardList
                thisCardSetId={state.page.cardSet.id}
                showActionButtons={state.permission.editCardSet}
                cardBeingDeleted={state.workspaceCardSet.cardWithCardSetsBeingDeleted?.card ?? null}
                onDeleteCard={card => actions.workspaceCardSet.deleteCardStart(card)}
                onEditCard={card => actions.createCardModal.openCreateCardModal({cardSetId: cardSet.id, card: card})}
                onEditCardCardSets={card => actions.editCardCardSetsModal.open(card.id)}
                cardsWithCardSets={state.workspaceCardSet.cardsWithCardSets}
                sorting={state.workspaceCardSet.sorting}
                onSortCard={(cardId, direction) => actions.workspaceCardSet.sortCard({cardId, direction})}
            />
        }

        {state.workspaceCardSet.sorting ?
            <>
                <Button className="mt-5" variant="outline-success" onClick={() => actions.workspaceCardSet.sortCardSetSave()}>Save sort order</Button>
                <Button className={"mt-5 ms-3"} variant="outline-danger" onClick={() => actions.workspaceCardSet.sortCardSetCancel()}>Cancel</Button>
            </> :
            <>
                {state.permission.createCard ? <Button className="mt-5" variant="outline-success" onClick={() => actions.createCardModal.openCreateCardModal({cardSetId: cardSet.id, card: null})}>+ Create card</Button> : null}
                {state.permission.createCard ? <Button className="mt-5 ms-3" variant="outline-success" onClick={() => actions.addCardsFromOtherCardSetsModal.open(cardSet.id)}>+ Add cards from other card sets</Button> : null}
                {state.permission.editCardSet ? <Button className="mt-5 ms-3" variant="outline-warning" href={pageUrls.workspaceCardSetEdit.url(state.page.workspace, state.page.cardSet)}><PencilSquare/> Edit card set</Button> : null}
                {state.permission.deleteCardSet ? <Button className="mt-5 ms-3" variant="outline-danger" onClick={() => actions.workspaceCardSet.deleteCardSet()}><DashCircle/> Delete card set</Button> : null}
                {state.permission.editCardSet ? <Button className="mt-5 ms-3" variant="outline-warning" onClick={() => actions.workspaceCardSet.sortCardSet()}><ArrowLeftRight/> Sort card set</Button> : null}
            </>
        }

        {state.workspaceCardSet.showConfirmDeleteModal && state.workspaceCardSet.cardWithCardSetsBeingDeleted !== null ? <DeleteCardModal
            loading={state.workspaceCardSet.loadingDeleteCardModal}
            cardSet={state.page.cardSet}
            onClose={() => actions.workspaceCardSet.deleteCardCancel()}
            onConfirm={(allCardSets: boolean) => actions.workspaceCardSet.deleteCardConfirm(allCardSets)}
            confirming={state.workspaceCardSet.confirmingDeleteCard}
            cardBeingDeletedExistsInOtherCardSets={state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets}
            cardWithCardSets={state.workspaceCardSet.cardWithCardSetsBeingDeleted}/> : null}
        <AddCardsFromOtherCardSetsModal/>
        <EditCardCardSetsModal/>
        <DeleteCardSetModal/>
    </Container>;
}

export default WorkspaceCardSetPage;