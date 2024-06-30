import {useActions, useAppState} from "../../overmind";
import { Button, Container, ListGroup } from "react-bootstrap";
import React, { useState } from "react";
import { Pages, pageUrls } from "../../page-urls";
import { Workspace } from "@elr0berto/robert-learns-shared/dist/api/models";
import {
    PencilSquare,
    ChevronDown,
    ChevronRight,
    ArrowLeftRight,
    ChevronUp,
    ChevronDoubleUp,
    ChevronDoubleDown
} from "react-bootstrap-icons";
import Loading from "../Loading";
import { CardSetWithChildren } from "../../overmind/data/data-state";

interface CardSetWithChildrenProps {
    cardSetWithChildren: CardSetWithChildren;
    level: number;
    parentId: number;
    siblingsCount: number;
    first: boolean;
    last: boolean;
}

function CardSetWithChildrenComponent(props: CardSetWithChildrenProps) {
    const state = useAppState();
    const actions = useActions();

    const [isOpen, setIsOpen] = useState(false);

    if (state.page.workspace === null) {
        throw new Error('Workspace is null');
    }
    return (
        <ListGroup.Item className={`card-set-with-children level-${props.level}`}>
            <div className="mb-1 d-flex">
                {props.cardSetWithChildren.children.length > 0 && (
                    <div className="me-1 chevron" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                    </div>
                )}
                <a href={pageUrls[Pages.WorkspaceCardSet].url(state.page.workspace, props.cardSetWithChildren.cardSet)}>
                    {props.cardSetWithChildren.cardSet.name}
                </a>
                {state.workspacePage.sorting && props.siblingsCount > 1 ?
                    <>
                        <Button
                            disabled={props.first}
                            className="ms-2"
                            size="sm"
                            onClick={() => actions.workspacePage.sortCardSet({
                                cardSetId: props.cardSetWithChildren.cardSet.id,
                                parentId: props.parentId,
                                direction: 'first'
                            })}
                        >
                            <ChevronDoubleUp/>
                        </Button>
                        <Button
                            disabled={props.first}
                            className="ms-2"
                            size="sm"
                            onClick={() => actions.workspacePage.sortCardSet({
                                cardSetId: props.cardSetWithChildren.cardSet.id,
                                parentId: props.parentId,
                                direction: 'up'
                            })}
                        >
                            <ChevronUp/>
                        </Button>
                        <Button
                            disabled={props.last}
                            className="ms-2"
                            size="sm"
                            onClick={() => actions.workspacePage.sortCardSet({
                                cardSetId: props.cardSetWithChildren.cardSet.id,
                                parentId: props.parentId,
                                direction: 'down'
                            })}
                        >
                            <ChevronDown/>
                        </Button>
                        <Button
                            disabled={props.last}
                            className="ms-2"
                            size="sm"
                            onClick={() => actions.workspacePage.sortCardSet({
                                cardSetId: props.cardSetWithChildren.cardSet.id,
                                parentId: props.parentId,
                                direction: 'last'
                            })}
                        >
                            <ChevronDoubleDown/>
                        </Button>
                    </> : null}

            </div>
            {isOpen && props.cardSetWithChildren.children.length > 0 && (
                <ListGroup className="mt-2">
                    {props.cardSetWithChildren.children.map(child => (
                        <CardSetWithChildrenComponent
                            key={child.cardSet.id}
                            cardSetWithChildren={child}
                            level={props.level + 1}
                            parentId={props.cardSetWithChildren.cardSet.id}
                            siblingsCount={props.cardSetWithChildren.children.length}
                            first={props.cardSetWithChildren.children.indexOf(child) === 0}
                            last={props.cardSetWithChildren.children.indexOf(child) === props.cardSetWithChildren.children.length - 1}
                        />
                    ))}
                </ListGroup>
            )}
        </ListGroup.Item>
    );
}

function renderCardSets(cardSetsWithChildren: CardSetWithChildren[], workspace: Workspace, level: number) {
    return (
        <ListGroup>
            {cardSetsWithChildren.map(cardSetWithChildren => (
                <CardSetWithChildrenComponent
                    key={cardSetWithChildren.cardSet.id}
                    cardSetWithChildren={cardSetWithChildren}
                    level={level}
                    parentId={0}
                    siblingsCount={cardSetsWithChildren.length}
                    first={cardSetsWithChildren.indexOf(cardSetWithChildren) === 0}
                    last={cardSetsWithChildren.indexOf(cardSetWithChildren) === cardSetsWithChildren.length - 1}
                />
            ))}
        </ListGroup>
    );
}

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
                    >
                        <PencilSquare/> Edit workspace
                    </Button> : null}
                {state.permission.editWorkspace && state.page.cardSetsWithChildren.length > 0 ?
                    <Button
                        onClick={actions.workspacePage.sortCardSets}
                    >
                        <ArrowLeftRight/> Sort card sets
                    </Button> : null}
            </div>
            {state.page.loadingCardSets ?
                <p>Loading card sets...</p> :
                <div className="workspace-card-sets">
                    {renderCardSets(state.workspacePage.cardSetsWithChildren, state.page.workspace, 0)}
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
