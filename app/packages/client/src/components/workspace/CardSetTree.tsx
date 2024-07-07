import {useActions, useAppState} from "../../overmind";
import React, {useState} from "react";
import {Button, ListGroup} from "react-bootstrap";
import {ChevronDoubleDown, ChevronDoubleUp, ChevronDown, ChevronRight, ChevronUp} from "react-bootstrap-icons";
import {Pages, pageUrls} from "../../page-urls";
import {CardSetWithChildren} from "../../overmind/data/data-state";

interface CardSetWithChildrenProps {
    cardSetWithChildren: CardSetWithChildren;
    level: number;
    parentId: number;
    siblingsCount: number;
    first: boolean;
    last: boolean;
    defaultOpen: boolean;
}

function CardSetWithChildrenComponent(props: CardSetWithChildrenProps) {
    const state = useAppState();
    const actions = useActions();

    const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);

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
                            defaultOpen={props.defaultOpen}
                        />
                    ))}
                </ListGroup>
            )}
        </ListGroup.Item>
    );
}

type CardSetTreeProps = {
    cardSetsWithChildren: CardSetWithChildren[];
    level: number;
    defaultOpen: boolean;
}
function CardSetTree(props: CardSetTreeProps) {
    return (
        <ListGroup>
            {props.cardSetsWithChildren.map(cardSetWithChildren => (
                <CardSetWithChildrenComponent
                    key={cardSetWithChildren.cardSet.id}
                    cardSetWithChildren={cardSetWithChildren}
                    level={props.level}
                    parentId={0}
                    siblingsCount={props.cardSetsWithChildren.length}
                    first={props.cardSetsWithChildren.indexOf(cardSetWithChildren) === 0}
                    last={props.cardSetsWithChildren.indexOf(cardSetWithChildren) === props.cardSetsWithChildren.length - 1}
                    defaultOpen={props.defaultOpen}
                />
            ))}
        </ListGroup>
    );
}

export default CardSetTree;