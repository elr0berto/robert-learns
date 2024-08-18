import {useActions, useAppState} from "../../overmind";
import React, {useState} from "react";
import {Button, ListGroup} from "react-bootstrap";
import {ChevronDoubleDown, ChevronDoubleUp, ChevronDown, ChevronRight, ChevronUp} from "react-bootstrap-icons";
import {Pages, pageUrls} from "../../page-urls";
import {CardSetWithChildrenAndCardCounts} from "../../overmind/data/data-state";

interface CardSetWithChildrenAndCardCountsProps {
    cardSetWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts;
    level: number;
    parentId: number;
    siblingsCount: number;
    first: boolean;
    last: boolean;
    defaultOpen: boolean;
}

function CardSetWithChildrenAndCardCountsComponent(props: CardSetWithChildrenAndCardCountsProps) {
    const state = useAppState();
    const actions = useActions();

    const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);

    if (state.page.workspace === null) {
        throw new Error('Workspace is null');
    }
    return (
        <ListGroup.Item className={`card-set-with-children level-${props.level}`}>
            <div className="mb-1 d-flex">
                {props.cardSetWithChildrenAndCardCounts.children.length > 0 && (
                    <div className="me-1 chevron" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                    </div>
                )}
                <a href={pageUrls[Pages.WorkspaceCardSet].url(state.page.workspace, props.cardSetWithChildrenAndCardCounts.cardSet)}>
                    {props.cardSetWithChildrenAndCardCounts.cardSet.name} ({props.cardSetWithChildrenAndCardCounts.cardCount})
                </a>
                {state.workspacePage.sorting && props.siblingsCount > 1 ?
                    <>
                        <Button
                            disabled={props.first}
                            className="ms-2"
                            size="sm"
                            onClick={() => actions.workspacePage.sortCardSet({
                                cardSetId: props.cardSetWithChildrenAndCardCounts.cardSet.id,
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
                                cardSetId: props.cardSetWithChildrenAndCardCounts.cardSet.id,
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
                                cardSetId: props.cardSetWithChildrenAndCardCounts.cardSet.id,
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
                                cardSetId: props.cardSetWithChildrenAndCardCounts.cardSet.id,
                                parentId: props.parentId,
                                direction: 'last'
                            })}
                        >
                            <ChevronDoubleDown/>
                        </Button>
                    </> : null}

            </div>
            {isOpen && props.cardSetWithChildrenAndCardCounts.children.length > 0 && (
                <ListGroup className="mt-2">
                    {props.cardSetWithChildrenAndCardCounts.children.map(child => (
                        <CardSetWithChildrenAndCardCountsComponent
                            key={child.cardSet.id}
                            cardSetWithChildrenAndCardCounts={child}
                            level={props.level + 1}
                            parentId={props.cardSetWithChildrenAndCardCounts.cardSet.id}
                            siblingsCount={props.cardSetWithChildrenAndCardCounts.children.length}
                            first={props.cardSetWithChildrenAndCardCounts.children.indexOf(child) === 0}
                            last={props.cardSetWithChildrenAndCardCounts.children.indexOf(child) === props.cardSetWithChildrenAndCardCounts.children.length - 1}
                            defaultOpen={props.defaultOpen}
                        />
                    ))}
                </ListGroup>
            )}
        </ListGroup.Item>
    );
}

type CardSetTreeProps = {
    cardSetsWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts[];
    level: number;
    defaultOpen: boolean;
}
function CardSetTree(props: CardSetTreeProps) {
    return (
        <ListGroup>
            {props.cardSetsWithChildrenAndCardCounts.map(cardSetWithChildrenAndCardCounts => (
                <CardSetWithChildrenAndCardCountsComponent
                    key={cardSetWithChildrenAndCardCounts.cardSet.id}
                    cardSetWithChildrenAndCardCounts={cardSetWithChildrenAndCardCounts}
                    level={props.level}
                    parentId={0}
                    siblingsCount={props.cardSetsWithChildrenAndCardCounts.length}
                    first={props.cardSetsWithChildrenAndCardCounts.indexOf(cardSetWithChildrenAndCardCounts) === 0}
                    last={props.cardSetsWithChildrenAndCardCounts.indexOf(cardSetWithChildrenAndCardCounts) === props.cardSetsWithChildrenAndCardCounts.length - 1}
                    defaultOpen={props.defaultOpen}
                />
            ))}
        </ListGroup>
    );
}

export default CardSetTree;