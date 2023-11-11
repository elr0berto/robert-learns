import {useActions, useAppState} from "../../overmind";
import React from "react";
import {Container, Dropdown} from "react-bootstrap";

function DrillPage() {
    const state = useAppState();
    const actions = useActions();

    if (state.page.loadingDrills) {
        return <Container>Loading...</Container>;
    }

    return <Container>
        <Dropdown>
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

export default DrillPage;