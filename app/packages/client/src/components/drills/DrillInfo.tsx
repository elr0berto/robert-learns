import {useActions, useAppState} from "../../overmind";
import React from "react";
import {Alert, Button} from "react-bootstrap";
import Loading from "../Loading";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(LocalizedFormat);


function DrillInfo() {
    const state = useAppState();
    const actions = useActions();

    if (state.drillPage.selectedDrillId === 'none') {
        return null;
    }

    return (
        <>
            <Alert variant={'info'} className="mt-3">
                Number of cards selected: <strong>{state.drillPage.selectedCardIds.length}</strong>
            </Alert>
            {state.drillPage.selectedDrillId === 'new' ? null :
                <Alert variant={'warning'}>
                    {state.drillPage.loadingPossibleResumeDrillRun ?
                        <Loading text={'Loading previous drill runs...'}/> :
                        state.drillPage.possibleResumeDrillRunWithNumbers !== null ?
                            <>
                                <p>
                                Do you want to resume your drill run from {dayjs(state.drillPage.possibleResumeDrillRunWithNumbers.lastAnsweredAt ?? state.drillPage.possibleResumeDrillRunWithNumbers.drillRun.startTime).format('LLL')}?<br/>
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
            }
        </>
    );
}

export default DrillInfo;