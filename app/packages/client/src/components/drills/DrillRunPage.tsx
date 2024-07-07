import React from "react";
import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Col, Container, Row} from "react-bootstrap";
import Loading from "../Loading";
import {pageUrls} from "../../page-urls";
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import {ArrowRepeat, CheckCircle, XCircle, CollectionPlay} from 'react-bootstrap-icons';

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
    return <Container className="mt-3 mb-5">
        <Row>
            <Col>
                <h1 className="mb-3 text-center">Drilling {state.drillRunPage.drill?.name ?? ''}</h1>
                {state.drillRunPage.completed ?
                    <>
                        <Alert variant="success">Drill completed. You got {state.drillRunPage.progressRights} right and {state.drillRunPage.progressWrongs} wrong!</Alert>
                        <Button variant={"outline-primary"} className="me-1" onClick={() => actions.drillRunPage.runAgain({wrongOnly: false})}><CollectionPlay/> Run again with the <strong>same</strong> cards</Button>
                        {state.drillRunPage.drillRun.isLimited ? <Button variant={"outline-primary"} className="me-1" onClick={() => actions.drillRunPage.runAgain({reset: true})}><CollectionPlay/> Run again with <strong>all</strong> cards</Button> : null}
                        {state.drillRunPage.progressWrongs > 0 ? <Button variant={"outline-primary"} className="me-1" onClick={() => actions.drillRunPage.runAgain({wrongOnly: true})}><CollectionPlay/> Run again with only the ones you got <strong>wrong</strong></Button> : null}
                    </> :
                    <>
                        <Row className="justify-content-center">
                            <Col md={4} className={"drill-run-question" + (state.drillRunPage.switchingCards ? " switching" : '')}>
                                <div className="switching-overlay"></div>
                                <div className={"drill-run-card " + state.drillRunPage.side}>
                                    <div className="side">{state.drillRunPage.side}</div>
                                    <div
                                        className={"drill-run-question-content ql-editor" + (state.drillRunPage.contentEmpty ? ' empty' : '')}
                                        dangerouslySetInnerHTML={{__html: state.drillRunPage.content ?? ''}}/>
                                    {state.drillRunPage.audioSrc ?
                                        <AudioPlayer autoPlay={false} autoPlayAfterSrcChange={false}
                                                     src={state.drillRunPage.audioSrc}/> : null}
                                </div>
                                {state.drillRunPage.twoSided ? <Button className="d-block w-100 mb-3"
                                                                       onClick={() => actions.drillRunPage.flip()}><ArrowRepeat/> Reveal/Flip</Button> : null}

                                <div className="drill-run-question-controls d-flex">
                                    <Button className="d-block w-100" variant={'success'}
                                            onClick={() => actions.drillRunPage.answer(true)}><CheckCircle/> Right</Button>
                                    <Button className="d-block w-100 ms-3" variant={'danger'}
                                            onClick={() => actions.drillRunPage.answer(false)}><XCircle/> Wrong</Button>
                                </div>
                            </Col>
                        </Row>
                        <div className="driil-run-progress-wrapper mt-5">
                            <div className="drill-run-progress">
                                {state.drillRunPage.questions.map(q =>
                                    <div
                                        key={q.id}
                                        className={q.correct === null ? 'not-answered' : (q.correct ? 'correct' : 'wrong')}
                                    />
                                )}
                            </div>
                            <div className="numbers text-center mt-1">Progress {state.drillRunPage.progress} / {state.drillRunPage.progressTotal}</div>
                        </div>
                    </>
                }
            </Col>
        </Row>
    </Container>;
}

export default DrillRunPage;