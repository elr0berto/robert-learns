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
import {
    ArrowLeftRight,
    Check2Circle,
    DashCircle,
    FilePlus,
    PencilSquare,
    PlusCircle,
    XCircle
} from "react-bootstrap-icons";
import LinkCardSetsModal from "./LinkCardSetsModal";
import CardSetTree from "./CardSetTree";
import Loading from "../Loading";

function WorkspaceCardSetPage() {
    const state = useAppState();
    const actions = useActions();

    if (state.page.loadingWorkspaces) {
        return <Container className="my-5"><Loading text="Loading workspaces..."/></Container>;
    } else if (state.page.workspace === null) {
        return <Container className="my-5">Workspace not found.</Container>
    }

    if (state.page.cardSet === null || state.page.cardSetWithChildrenAndCardCounts === null) {
        return <Container className="my-5">Card set not found.</Container>
    }

    const cardSet : CardSet = state.page.cardSet;
    const hasCards = state.workspaceCardSet.cardsWithCardSetsWithFlatAncestorCardSets.length > 0;
    const hasChildren = state.page.cardSetWithChildrenAndCardCounts.children.length > 0;

    return <Container className="mb-5">
        <h1 className="my-5">
            Card set <i>{state.page.cardSet.name}</i> in workspace <i>{state.page.workspace.name}</i>
        </h1>

        {state.workspaceCardSet.sorting ?
            <>
                <Button disabled={state.workspaceCardSet.savingSorting} className="mb-5" variant="primary" onClick={() => actions.workspaceCardSet.sortCardSetSave()}><Check2Circle/> Save sort order</Button>
                <Button disabled={state.workspaceCardSet.savingSorting} className={"mb-5 ms-3"} variant="outline-danger" onClick={() => actions.workspaceCardSet.sortCardSetCancel()}><XCircle/> Cancel</Button>
            </> :
            null}

        {state.page.loadingCards ?
            <Loading text="Loading cards..."/> :
            <>
                {!state.workspaceCardSet.sorting ?
                    <>
                        {state.permission.editCardSet ? <Button className="mb-5" variant="outline-primary" href={pageUrls.workspaceCardSetEdit.url(state.page.workspace, state.page.cardSet)}><PencilSquare/> Edit card set</Button> : null}
                        {!hasChildren && state.permission.createCard ? <Button className="mb-5 ms-3" variant="outline-primary" onClick={() => actions.createCardModal.openCreateCardModal({cardSetId: cardSet.id, card: null})}><FilePlus/> Create card</Button> : null}
                        {!hasChildren && state.permission.createCard ? <Button className="mb-5 ms-3" variant="outline-primary" onClick={() => actions.addCardsFromOtherCardSetsModal.open(cardSet.id)}>+ Add cards from other card sets</Button> : null}
                        {!hasChildren && state.permission.editCardSet ? <Button className="mb-5 ms-3" variant="outline-primary" onClick={() => actions.workspaceCardSet.sortCardSet()}><ArrowLeftRight/> Sort card set</Button> : null}
                        {!hasCards && state.permission.editCardSet ? <Button className="mb-5 ms-3" variant="outline-primary" onClick={() => actions.linkCardSetsModal.open(cardSet.id)}><PlusCircle/> Link other card sets</Button> : null}
                        {state.permission.deleteCardSet ? <Button className="mb-5 ms-3" variant="outline-danger" onClick={() => actions.workspaceCardSet.deleteCardSet()}><DashCircle/> Delete card set</Button> : null}
                    </> : null}
                {hasChildren && <CardSetTree cardSetsWithChildrenAndCardCounts={[state.page.cardSetWithChildrenAndCardCounts]} level={0} defaultOpen={true}/>}
                {!hasChildren && <CardList
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
                />}
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