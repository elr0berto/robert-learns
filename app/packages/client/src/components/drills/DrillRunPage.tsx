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
    if (state.page.loadingWorkspaces) {
        loading.push('workspaces');
    }
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

    if (state.drillRunPage.drillRun === null) {
        throw new Error('Drill run not found');
    }
    return <Container className="mt-3">
        <Row>
            <Col md={8}>
                <h1 className="mb-3">Drilling {state.drillRunPage.drill?.name ?? ''}</h1>
                {state.drillRunPage.completed ?
                    <>
                        <Alert variant="success">Drill completed. You got {state.drillRunPage.progressRights} right and {state.drillRunPage.progressWrongs} wrong!</Alert>
                        <Button onClick={() => actions.drillRunPage.runAgain({wrongOnly: false})}>Run Again with the same cards</Button>
                        {state.drillRunPage.drillRun.isLimited ? <Button onClick={() => actions.drillRunPage.runAgain({reset: true})}>Run Again with all cards</Button> : null}
                        {state.drillRunPage.progressWrongs > 0 ? <Button onClick={() => actions.drillRunPage.runAgain({wrongOnly: true})}>Run Again with only the ones you got wrong</Button> : null}
                    </> :
                    <>
                        <div className="drill-run-question">
                            <div className={"drill-run-question-content ql-editor" + (state.drillRunPage.contentEmpty ? ' empty' : '')} dangerouslySetInnerHTML={{__html: state.drillRunPage.content ?? ''}}/>
                            {state.drillRunPage.twoSided ? <Button onClick={() => actions.drillRunPage.flip()}>Reveal/Flip</Button> : null}
                            {state.drillRunPage.audioSrc ? <AudioPlayer autoPlay={false} autoPlayAfterSrcChange={false} src={state.drillRunPage.audioSrc}/> : null}
                            <div className="drill-run-question-controls">
                                <Button variant={'success'} onClick={() => actions.drillRunPage.answer(true)}>Right</Button>
                                <Button className="mx-5" variant={'danger'} onClick={() => actions.drillRunPage.answer(false)}>Wrong</Button>
                            </div>
                        </div>
                        <div className="drill-run-progress mt-5">
                            <div className="numbers">{state.drillRunPage.progress} / {state.drillRunPage.progressTotal}</div>
                            {state.drillRunPage.questions.map(q =>
                                <div
                                    key={q.id}
                                    className={q.correct === null ? 'not-answered' : (q.correct ? 'correct' : 'wrong')}
                                />
                            )}
                        </div>
                    </>
                }
            </Col>
        </Row>
    </Container>;
}

export default DrillRunPage;