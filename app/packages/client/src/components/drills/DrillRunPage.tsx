import React from "react";
import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import Loading from "../Loading";
import {pageUrls} from "../../page-urls";
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';

function DrillRunPage() {
    const state = useAppState();
    const actions = useActions();

    const loading : string[] = [];
    if (state.page.loadingDrillRuns) {
        loading.push('drill run');
    }
    if (loading.length > 0) {
        return <Container>
            <Loading text={'Loading ' + loading.join(', ')+'...'}/>
        </Container>;
    }

    if (state.signIn.isGuest) {
        return <Container className="mt-3">
            <Row>
                <Col md={8}>
                    <h1 className="mb-3">Drill</h1>
                    <Alert variant="warning">
                        You need to <a href={pageUrls.signIn.url()}>sign in</a> to create or run drills.
                    </Alert>
                </Col>
            </Row>
        </Container>;
    }

    return <Container className="mt-3">
        <Row>
            <Col md={8}>
                <h1 className="mb-3">Drilling {state.drillRunPage.drill?.name ?? ''}</h1>
                {state.drillRunPage.completed ?
                    <>
                        <Alert variant="success">Drill completed</Alert>
                    </> :
                    <>
                        <div className="drill-run-question">
                            <div className={"drill-run-question-content" + (state.drillRunPage.contentEmpty ? ' empty' : '')}>
                                {state.drillRunPage.content}
                            </div>
                            {state.drillRunPage.twoSided ? <Button onClick={() => actions.drillRunPage.flip()}>Flip</Button> : null}
                            {state.drillRunPage.audioSrc ? <AudioPlayer src={state.drillRunPage.audioSrc}/> : null}
                            <div className="drill-run-question-controls">
                                <Button onClick={() => actions.drillRunPage.right()}>Right</Button>
                                <Button onClick={() => actions.drillRunPage.wrong()}>Wrong</Button>
                            </div>
                        </div>
                        <div className="progress">
                            {state.drillRunPage.questions.map(q => <div key={q.id} className={q.correct === null ? 'not-answered' : (q.correct ? 'correct' : 'wrong')}/>)}
                        </div>
                    </>
                }
            </Col>
        </Row>
    </Container>;
}

export default DrillRunPage;