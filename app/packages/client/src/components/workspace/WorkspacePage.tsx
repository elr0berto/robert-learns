import {/*useActions,*/ useAppState} from "../../overmind";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import React from "react";
import {Pages, pageUrls} from "../../page-urls";
import {Workspace} from "@elr0berto/robert-learns-shared/dist/api/models";
import {PencilSquare} from "react-bootstrap-icons";
import Loading from "../Loading";

function WorkspacePage() {
    const state = useAppState();
    //const actions = useActions();

    if (state.page.workspace === null) {
        if (state.page.loadingWorkspaces) {
            return <Container><Loading/></Container>;
        } else {
            return <Container>Workspace not found.</Container>
        }
    }
    return <Container>
        <h1 className="my-5">Workspace {state.page.workspace.name}</h1>
        {state.page.loadingCardSets ?
            <p>Loading card sets...</p> :
            <Container>
                <Row>
                    {state.page.cardSets.map((cardSet, index) => (
                        <Col key={index} sm={12} md={6} lg={4} xl={3}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{cardSet.name}</Card.Title>
                                    <Card.Text>{cardSet.description}</Card.Text>
                                    <Card.Link href={pageUrls[Pages.WorkspaceCardSet].url(state.page.workspace as Workspace, cardSet)}>Go to card set</Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        }
        <div className="mt-3 buttons">
            {state.permission.editWorkspace ? <Button href={pageUrls.workspaceEdit.url(state.page.workspace)}><PencilSquare/> Edit workspace</Button> : null}
        </div>
    </Container>;
}

export default WorkspacePage;