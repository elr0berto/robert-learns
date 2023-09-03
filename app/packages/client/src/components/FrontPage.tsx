import React from 'react';
import {useAppState} from "../overmind";
import {Card, Col, Container, Row} from "react-bootstrap";
import {Pages, pageUrls} from "../page-urls";

function FrontPage() {
    const state = useAppState();

    if (state.page.loadingWorkspaces) {
        return <Container>Loading...</Container>;
    }

    return (
        <Container className={'mt-3'}>
            <Row>
                {state.page.workspacesWithCardSetsCounts.map((item, index) => (
                    <Col key={index} sm={12} md={6} lg={4} xl={3}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{item.workspace.name}</Card.Title>
                                <Card.Subtitle>{item.cardSetsCount} card set(s)</Card.Subtitle>
                                <Card.Text>{item.workspace.description}</Card.Text>
                                <Card.Link href={pageUrls[Pages.Workspace].url(item.workspace)}>Go to workspace</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default FrontPage;