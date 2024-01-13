import {useActions, useAppState} from "../../overmind";
import React from "react";
import {Col, Container, Form, Row} from "react-bootstrap";
import Loading from "../Loading";
import TristateCheckbox from "../TristateCheckbox";

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

    return <Container className="mt-3">
        <Row>
            <Col md={8}>
                <h1 className="mb-3">Drill</h1>
                <Form.Select value={state.drillPage.selectedDrillId} onChange={event => actions.drillPage.changeDrill(event.target.value)}>
                    <option value={'none'}>Select drill</option>
                    <option value={'new'}>Create new drill</option>
                    {state.page.drills.map(drill => <option key={drill.id} value={drill.id}>{drill.name}</option>)}
                </Form.Select>
                {state.drillPage.selectedDrillId !== 'none' ?
                    <>
                        <Form.Group controlId="drillName" className="mt-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={state.drillPage.drillName} onChange={event => actions.drillPage.changeDrillName(event.target.value)}/>
                        </Form.Group>
                        <Form.Group controlId="drillDescription" className="mt-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" value={state.drillPage.drillDescription} onChange={event => actions.drillPage.changeDrillDescription(event.target.value)}/>
                        </Form.Group>
                        <div className="mt-3">
                            {state.page.workspacesWithCardSets.map(wwcs =>
                                <>
                                    <TristateCheckbox
                                        className="mt-2"
                                        key={wwcs.workspace.id}
                                        label={wwcs.workspace.name}
                                        checked={state.drillPage.selectedWorkspaceIds.includes(wwcs.workspace.id)}
                                        onChange={event => actions.drillPage.toggleWorkspaceId(wwcs.workspace.id)}
                                        id={"workspaceCheckbox_"+wwcs.workspace.id}
                                        indeterminate={state.drillPage.indeterminateWorkspaceIds.includes(wwcs.workspace.id)}
                                    />
                                    {wwcs.cardSets.map(cardSet =>
                                        <Form.Check
                                            style={{marginLeft: '1rem'}}
                                            key={cardSet.id}
                                            type="checkbox"
                                            label={cardSet.name}
                                            checked={state.drillPage.selectedCardSetIds.includes(cardSet.id)}
                                            onChange={event => actions.drillPage.toggleCardSetId(cardSet.id)}
                                            id={"cardSetCheckbox_"+cardSet.id}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </> :
                null}
            </Col>
        </Row>
    </Container>;
}

export default DrillPage;