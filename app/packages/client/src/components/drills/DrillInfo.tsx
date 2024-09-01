import {useActions, useAppState} from "../../overmind";
import React from "react";
import {Alert, Button} from "react-bootstrap";
import Loading from "../Loading";
import dayjs from "dayjs";


function DrillInfo() {
    const state = useAppState();
    const actions = useActions();

    if (state.drillPage.selectedDrillId === 'none') {
        return null;
    }

    const drillName = state.drillPage.selectedDrillId === 'new' ? state.drillPage.drillName : state.drillPage.selectedDrillWithDrillCardSets?.drill.name ?? '';
    return (
        <>
            <Alert variant={'info'} className="mt-3">
                <Alert.Heading>Drill {drillName}</Alert.Heading>
                <p>Number of cards: <strong>{state.drillPage.selectedCardIds.length}</strong></p>
            </Alert>
            <Alert variant={'warning'}>
            {state.drillPage.loadingPossibleResumeDrillRun ?
                <Loading text={'Loading previous drill runs...'}/> :
                state.drillPage.possibleResumeDrillRunWithNumbers !== null ?
                    <>
                        <p>
                        Do you want to resume your drill run from {dayjs(state.drillPage.possibleResumeDrillRunWithNumbers.drillRun.startTime).format('LLL')}?<br/>
                        You already answered {state.drillPage.possibleResumeDrillRunWithNumbers.answeredCount} of {state.drillPage.possibleResumeDrillRunWithNumbers.questionCount} cards.
                        </p>
                        <hr/>
                        <Button variant="primary" onClick={() => actions.drillPage.saveDrill({run: true, resume: true})} disabled={state.drillPage.formDisabled}>
                            Yes, save and resume previous drill run
                        </Button>
                    </> :
                    <>
                        No previous drill runs found.
                    </>
            }
            </Alert>
        </>
    );
}

export default DrillInfo;