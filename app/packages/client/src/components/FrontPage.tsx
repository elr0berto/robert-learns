import React from 'react';
import {useAppState} from "../overmind";
import {Alert, Card, Col, Container, Row} from "react-bootstrap";
import {Pages, pageUrls} from "../page-urls";
import Loading from "./Loading";

function FrontPage() {
    const state = useAppState();

    if (state.page.loadingWorkspaces) {
        return <Container><Loading text="Loading workspaces..."/></Container>;
    }

    // Display welcome message always at the top
    const welcomeMessage = (
        <Alert variant="info">
            <Alert.Heading>Welcome to Robert Learns!</Alert.Heading>
            <p>
                Start your learning journey with virtual flash cards. Organize your study materials in workspaces and access them easily.
            </p>
            <hr />
            <p className="mb-0">
                You can add new workspaces anytime by using the menu options. Happy learning!
            </p>
        </Alert>
    );

    // Check if there are no workspaces and display just the welcome message
    if (state.page.workspacesWithCardSetsCounts.length === 0) {
        return (
            <Container className='mt-3'>
                {welcomeMessage}
            </Container>
        );
    }

    return (
        <Container className={'mt-3'}>
            {welcomeMessage}
            <Row>
                {state.page.workspacesWithCardSetsCounts.map((item, index) => (
                    <Col key={index} sm={12} md={6} lg={4} xl={3}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{item.workspace.name}</Card.Title>
                                <Card.Subtitle>{item.cardSetsCount} card set(s)</Card.Subtitle>
                                <Card.Text>{item.workspace.description}</Card.Text>
                                <Card.Link href={pageUrls[Pages.Workspace].url(item.workspace)}>Administer workspace</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default FrontPage;