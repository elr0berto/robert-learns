import {useActions, useAppState} from "../../overmind";
import React from "react";
import {Container, Form} from "react-bootstrap";

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
        return <Container>Loading {loading.join(', ')}...</Container>;
    }

    return <Container>
        <Form.Select value={state.drillPage.selectedDrillId} onChange={event => actions.drillPage.changeDrill(event.target.value)}>
            <option value={'none'}>Select drill</option>
            <option value={'new'}>Create new drill</option>
            {state.page.drills.map(drill => <option key={drill.id} value={drill.id}>{drill.name}</option>)}
        </Form.Select>
        {state.drillPage.selectedDrillId !== null ?
            <>
                <Form.Group controlId="drillName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={state.drillPage.drillName} onChange={event => actions.drillPage.changeDrillName(event.target.value)}/>
                </Form.Group>
                <Form.Group controlId="drillDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" value={state.drillPage.drillDescription} onChange={event => actions.drillPage.changeDrillDescription(event.target.value)}/>
                </Form.Group>
                {state.page.workspacesWithCardSets.map(wwcs =>
                    <>
                        <Form.Check
                            key={wwcs.workspace.id}
                            type="checkbox"
                            label={wwcs.workspace.name}
                            checked={state.drillPage.selectedWorkspaceIds.includes(wwcs.workspace.id)}
                            onChange={event => actions.drillPage.toggleWorkspaceId(wwcs.workspace.id)}
                        />
                        {wwcs.cardSets.map(cardSet =>
                            <Form.Check
                                style={{marginLeft: '2rem'}}
                                key={cardSet.id}
                                type="checkbox"
                                label={cardSet.name}
                                checked={state.drillPage.selectedCardSetIds.includes(cardSet.id)}
                                onChange={event => actions.drillPage.toggleCardSetId(cardSet.id)}
                            />
                        )}
                    </>
                )}
            </> :
        null}
    </Container>;
}

export default DrillPage;