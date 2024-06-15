import { useAppState } from "../../overmind";
import { Button, Container, ListGroup } from "react-bootstrap";
import React, { useState } from "react";
import { Pages, pageUrls } from "../../page-urls";
import { Workspace } from "@elr0berto/robert-learns-shared/dist/api/models";
import { PencilSquare, ChevronDown, ChevronRight } from "react-bootstrap-icons";
import Loading from "../Loading";
import { CardSetWithChildren } from "../../overmind/data/data-state";

interface CardSetWithChildrenProps {
    cardSetWithChildren: CardSetWithChildren;
    workspace: Workspace;
    level: number;
}

function CardSetWithChildrenComponent({ cardSetWithChildren, workspace, level }: CardSetWithChildrenProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ListGroup.Item className={`card-set-with-children level-${level}`}>
            <div className="mb-1 d-flex">
                {cardSetWithChildren.children.length > 0 && (
                    <div className="me-1" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <ChevronDown size={24} /> : <ChevronRight size={24}/>}
                    </div>
                )}
                <a href={pageUrls[Pages.WorkspaceCardSet].url(workspace, cardSetWithChildren.cardSet)}>
                    {cardSetWithChildren.cardSet.name}
                </a>
            </div>
            {isOpen && cardSetWithChildren.children.length > 0 && (
                <ListGroup className="mt-2">
                    {cardSetWithChildren.children.map(child => (
                        <CardSetWithChildrenComponent
                            key={child.cardSet.id}
                            cardSetWithChildren={child}
                            workspace={workspace}
                            level={level + 1}
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
                    workspace={workspace}
                    level={level}
                />
            ))}
        </ListGroup>
    );
}

function WorkspacePage() {
    const state = useAppState();
    //const actions = useActions();

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
            {state.page.loadingCardSets ?
                <p>Loading card sets...</p> :
                <div className="workspace-card-sets">
                    {renderCardSets(state.page.cardSetsWithChildren, state.page.workspace, 0)}
                </div>
            }
            <div className="mt-3 buttons">
                {state.permission.editWorkspace ? <Button href={pageUrls.workspaceEdit.url(state.page.workspace)}><PencilSquare /> Edit workspace</Button> : null}
            </div>
        </Container>
    );
}

export default WorkspacePage;
