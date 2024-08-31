import {useActions, useAppState} from "../../overmind";
import React from "react";
import {Alert, Col, Row} from "react-bootstrap";
import Loading from "../Loading";


function DrillInfo() {
    const state = useAppState();
    const actions = useActions();

    if (state.drillPage.selectedDrillId === 'none') {
        return null;
    }

    const drillName = state.drillPage.selectedDrillId === 'new' ? state.drillPage.drillName : state.drillPage.selectedDrillWithDrillCardSets?.drill.name ?? '';
    return (
        <>
            <Alert variant={'info'}>
                <h1 className="my-5">Drill {drillName}</h1>
                <Row>
                    <Col>
                        <p>Number of cards: {state.drillPage.selectedCardIds.length}</p>
                        <p>Number of card sets: {state.drillPage.selectedCardSetIds.length}</p> // do not count cardsets-with-children?
                    </Col>
                </Row>
            </Alert>
            {/*state.drillPage.potentialResumeLoading ?
                <Loading text={'Loading previous drill runs...'}/> :
                state.drillPage.potentialResumeDrillRun ?
                    <Alert variant={'info'}>
                        <p>Would you like to resume the previous drill run?</p>
                        <p>You answered {state.drillPage.potentialResumeDrillRun.answeredCount} / {state.drillPage.potentialResumeDrillRun.cardCount}</p>
                        <button className="btn btn-primary" onClick={() => actions.drillPage.resumeDrillRun()}>Resume</button>
                    </Alert> :
                    <Alert variant={'info'}>
                        <p>No previous drill runs found.</p>
                    </Alert>
            */}
        </>
    );
}

export default DrillInfo;