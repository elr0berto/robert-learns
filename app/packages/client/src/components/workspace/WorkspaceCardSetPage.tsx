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
import {ArrowLeftRight, DashCircle, PencilSquare, PlusCircle} from "react-bootstrap-icons";
import LinkCardSetsModal from "./LinkCardSetsModal";

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
    if (state.page.cardSet === null || state.page.cardSetWithChildren === null) {
        if (state.page.loadingCardSets) {
            return <Container className="my-5">Loading...</Container>;
        } else {
            return <Container className="my-5">Card set not found.</Container>
        }
    }

    const cardSet : CardSet = state.page.cardSet;
    const hasCards = state.workspaceCardSet.cardsWithCardSetsWithFlatAncestorCardSets.length > 0;
    const hasChildren = state.page.cardSetWithChildren.children.length > 0;

    return <Container className="mb-5">
        <h1 className="my-5">
            Card set <i>{state.page.cardSet.name}</i> in workspace <i>{state.page.workspace.name}</i>
        </h1>

        {state.workspaceCardSet.sorting ?
            <>
                <Button disabled={state.workspaceCardSet.savingSorting} className="mb-5" variant="outline-success" onClick={() => actions.workspaceCardSet.sortCardSetSave()}>Save sort order</Button>
                <Button disabled={state.workspaceCardSet.savingSorting} className={"mb-5 ms-3"} variant="outline-danger" onClick={() => actions.workspaceCardSet.sortCardSetCancel()}>Cancel</Button>
            </> :
            null}

        {state.page.loadingCards ?
            <div>Loading cards...</div> :
            <>
                {state.permission.editCardSet ? <Button className="mb-5" variant="outline-primary" href={pageUrls.workspaceCardSetEdit.url(state.page.workspace, state.page.cardSet)}><PencilSquare/> Edit card set</Button> : null}
                {!hasChildren && state.permission.createCard ? <Button className="mb-5 ms-3" variant="outline-primary" onClick={() => actions.createCardModal.openCreateCardModal({cardSetId: cardSet.id, card: null})}>+ Create card</Button> : null}
                {!hasChildren && state.permission.createCard ? <Button className="mb-5 ms-3" variant="outline-primary" onClick={() => actions.addCardsFromOtherCardSetsModal.open(cardSet.id)}>+ Add cards from other card sets</Button> : null}
                {state.permission.editCardSet ? <Button className="mb-5 ms-3" variant="outline-primary" onClick={() => actions.workspaceCardSet.sortCardSet()}><ArrowLeftRight/> Sort card set</Button> : null}
                {!hasCards && state.permission.editCardSet ? <Button className="mb-5 ms-3" variant="outline-primary" onClick={() => actions.linkCardSetsModal.open(cardSet.id)}><PlusCircle/> Link other card sets</Button> : null}
                {state.permission.deleteCardSet ? <Button className="mb-5 ms-3" variant="outline-danger" onClick={() => actions.workspaceCardSet.deleteCardSet()}><DashCircle/> Delete card set</Button> : null}
                <CardList
                    thisCardSetId={state.page.cardSet.id}
                    showActionButtons={state.permission.editCardSet}
                    cardBeingDeleted={state.workspaceCardSet.cardWithCardSetsWithFlatAncestorCardSetsBeingDeleted?.card ?? null}
                    onDeleteCard={card => actions.workspaceCardSet.deleteCardStart(card)}
                    onEditCard={card => actions.createCardModal.openCreateCardModal({cardSetId: cardSet.id, card: card})}
                    onEditCardCardSets={card => actions.editCardCardSetsModal.open(card.id)}
                    cardsWithCardSetsWithFlatAncestorCardSets={state.workspaceCardSet.cardsWithCardSetsWithFlatAncestorCardSets}
                    sorting={state.workspaceCardSet.sorting}
                    savingSorting={state.workspaceCardSet.savingSorting}
                    onSortCard={(cardId, direction) => actions.workspaceCardSet.sortCard({cardId, direction})}
                />
            </>
        }

        {state.workspaceCardSet.showConfirmDeleteModal && state.workspaceCardSet.cardWithCardSetsWithFlatAncestorCardSetsBeingDeleted !== null ? <DeleteCardModal
            loading={state.workspaceCardSet.loadingDeleteCardModal}
            cardSet={state.page.cardSet}
            onClose={() => actions.workspaceCardSet.deleteCardCancel()}
            onConfirm={(allCardSets: boolean) => actions.workspaceCardSet.deleteCardConfirm(allCardSets)}
            confirming={state.workspaceCardSet.confirmingDeleteCard}
            cardBeingDeletedExistsInOtherCardSets={state.workspaceCardSet.cardBeingDeletedExistsInOtherCardSets}
            cardWithCardSetsWithFlatAncestorCardSets={state.workspaceCardSet.cardWithCardSetsWithFlatAncestorCardSetsBeingDeleted}/> : null}

        <AddCardsFromOtherCardSetsModal/>
        <EditCardCardSetsModal/>
        <DeleteCardSetModal/>
        <LinkCardSetsModal/>
    </Container>;
}

export default WorkspaceCardSetPage;