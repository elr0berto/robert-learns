import localizedFormat from 'dayjs/plugin/localizedFormat';
import {Button, Modal} from "react-bootstrap";
import React from "react";
import {useActions, useAppState} from "../../overmind";
import dayjs from "dayjs";

dayjs.extend(localizedFormat);

function ResumeDrillRunModal() {
    const state = useAppState();
    const actions = useActions();

    if (state.drillPage.possibleResumeDrillRunWithNumbers === null) {
        throw new Error('No possible drill run to resume');
    }
    return <Modal show onHide={state.drillPage.formDisabled ? () => {} : () => actions.drillPage.closeResumeDrillModal()}>
        <Modal.Header closeButton>
            <Modal.Title>Resume drill run?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Do you want to resume your drill run from {dayjs(state.drillPage.possibleResumeDrillRunWithNumbers.drillRun.startTime).format('LLL')}?<br/>
            You already answered {state.drillPage.possibleResumeDrillRunWithNumbers.answeredCount} of {state.drillPage.possibleResumeDrillRunWithNumbers.questionCount} cards.
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => actions.drillPage.saveDrill({run: true, resume: false})} disabled={state.drillPage.formDisabled}>
                No, run a new one
            </Button>
            <Button variant="primary" onClick={() => actions.drillPage.saveDrill({run: true, resume: true})} disabled={state.drillPage.formDisabled}>
                Yes, resume
            </Button>
        </Modal.Footer>
    </Modal>
}

export default ResumeDrillRunModal;