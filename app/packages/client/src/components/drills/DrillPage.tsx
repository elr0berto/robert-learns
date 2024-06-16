import {useActions, useAppState} from "../../overmind";
import React from "react";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import Loading from "../Loading";
import TristateCheckbox from "../TristateCheckbox";
import {pageUrls} from "../../page-urls";
import ResumeDrillRunModal from "./ResumeDrillRunModal";
import {CardSetWithChildren} from "../../overmind/data/data-state";


const CardSetCheckbox = ({cardSetWithChildren, level}: { cardSetWithChildren: CardSetWithChildren, level: number }) => {
    const state = useAppState();
    const actions = useActions();

    const marginLeft = `${level}rem`;
    const isIndeterminate = state.drillPage.indeterminateCardSetIds.includes(cardSetWithChildren.cardSet.id);
    const isChecked = state.drillPage.selectedCardSetIds.includes(cardSetWithChildren.cardSet.id);

    return (
        <>
            {cardSetWithChildren.children.length > 0 ? (
                <TristateCheckbox
                    style={{marginLeft}}
                    key={cardSetWithChildren.cardSet.id}
                    label={cardSetWithChildren.cardSet.name}
                    checked={isChecked}
                    indeterminate={isIndeterminate}
                    onChange={() => actions.drillPage.toggleCardSetId(cardSetWithChildren.cardSet.id)}
                    id={"cardSetCheckbox_" + cardSetWithChildren.cardSet.id}
                    disabled={state.drillPage.formDisabled}
                />
            ) : (
                <Form.Check
                    style={{marginLeft}}
                    key={cardSetWithChildren.cardSet.id}
                    type="checkbox"
                    label={cardSetWithChildren.cardSet.name}
                    checked={isChecked}
                    onChange={() => actions.drillPage.toggleCardSetId(cardSetWithChildren.cardSet.id)}
                    id={"cardSetCheckbox_" + cardSetWithChildren.cardSet.id}
                    disabled={state.drillPage.formDisabled}
                />
            )}
            {cardSetWithChildren.children.map(child => (
                <CardSetCheckbox key={child.cardSet.id} cardSetWithChildren={child} level={level + 1}/>
            ))}
        </>
    );
}

function DrillPage() {
    const state = useAppState();
    const actions = useActions();

    const loading : string[] = [];
    if (state.page.loadingDrills) {
        loading.push('drills');
    }
    if (state.page.loadingWorkspaces) {
        loading.push('workspaces');
    }
    if (state.page.loadingCardSets) {
        loading.push('card sets');
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

    return <Container className="mt-3 mb-5">
        <Row>
            <Col md={8}>
                <h1 className="mb-3">Drill</h1>
                <Form.Select
                    disabled={state.drillPage.formDisabled}
                    value={state.drillPage.selectedDrillId}
                    onChange={event => actions.drillPage.changeDrill(event.target.value)}
                >
                    <option key={'none'} value={'none'}>Select drill</option>
                    <option key={'new'} value={'new'}>Create new drill</option>
                    {state.page.drills.map(drill => <option key={drill.id} value={drill.id}>{drill.name}</option>)}
                </Form.Select>
                {state.drillPage.selectedDrillId !== 'none' ?
                    <>
                        <Form.Group controlId="drillName" className="mt-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                disabled={state.drillPage.formDisabled}
                                type="text"
                                value={state.drillPage.drillName}
                                onChange={event => actions.drillPage.changeDrillName(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="drillDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                disabled={state.drillPage.formDisabled}
                                as="textarea"
                                value={state.drillPage.drillDescription}
                                onChange={event => actions.drillPage.changeDrillDescription(event.target.value)}
                            />
                        </Form.Group>
                        <div className="mt-3">
                            {state.page.workspacesWithCardSetsWithChildren.map(wwcs =>
                                <>
                                    <TristateCheckbox
                                        className="mt-2"
                                        key={wwcs.workspace.id}
                                        label={wwcs.workspace.name}
                                        checked={state.drillPage.selectedWorkspaceIds.includes(wwcs.workspace.id)}
                                        onChange={event => actions.drillPage.toggleWorkspaceId(wwcs.workspace.id)}
                                        id={"workspaceCheckbox_"+wwcs.workspace.id}
                                        indeterminate={state.drillPage.indeterminateWorkspaceIds.includes(wwcs.workspace.id)}
                                        disabled={state.drillPage.formDisabled}
                                    />
                                    {wwcs.cardSetsWithChildren.map(cardSetWithChildren =>
                                        <CardSetCheckbox key={cardSetWithChildren.cardSet.id} cardSetWithChildren={cardSetWithChildren} level={1}/>
                                    )}
                                </>
                            )}
                        </div>
                        {state.drillPage.saveAttempted && state.drillPage.errorMessage !== null ?
                            <Alert variant="danger" className="mt-3">{state.drillPage.errorMessage}</Alert> :
                            null}

                        {state.drillPage.saving ? <Loading text="Saving..."/> : null}

                        <Button
                            disabled={state.drillPage.formDisabled}
                            className="mt-3"
                            variant="outline-success" onClick={() => actions.drillPage.saveDrill({run: false})}
                        >
                            Save
                        </Button>
                        <Button
                            disabled={state.drillPage.formDisabled}
                            className="mt-3 ms-3"
                            variant="success"
                            onClick={() => actions.drillPage.runDrill()}
                        >
                            Run (and save)
                        </Button>
                    </> :
                null}
            </Col>
        </Row>
        {state.drillPage.possibleResumeDrillRunWithNumbers === null ? null : <ResumeDrillRunModal/>}
    </Container>;
}

export default DrillPage;