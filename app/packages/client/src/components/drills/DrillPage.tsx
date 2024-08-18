import {useActions, useAppState} from "../../overmind";
import React from "react";
import {Alert, Button, Col, Container, Form, Row} from "react-bootstrap";
import Loading from "../Loading";
import TristateCheckbox from "../TristateCheckbox";
import {pageUrls} from "../../page-urls";
import ResumeDrillRunModal from "./ResumeDrillRunModal";
import {CardSetWithChildrenAndCardCounts} from "../../overmind/data/data-state";
import {DashSquareDotted, PlusSquareDotted} from 'react-bootstrap-icons';


const CardSetCheckbox = ({cardSetWithChildrenAndCardCounts, level}: { cardSetWithChildrenAndCardCounts: CardSetWithChildrenAndCardCounts, level: number }) => {
    const state = useAppState();
    const actions = useActions();

    const marginLeft = `${level*1.25}rem`;
    const isIndeterminate = state.drillPage.indeterminateCardSetIds.includes(cardSetWithChildrenAndCardCounts.cardSet.id);
    const isChecked = state.drillPage.selectedCardSetIds.includes(cardSetWithChildrenAndCardCounts.cardSet.id);

    return (
        <>
            {cardSetWithChildrenAndCardCounts.children.length > 0 ? (
                <div className="d-flex flex-row" style={{marginLeft}}>
                    <div className="me-1 expand-toggle" onClick={() => actions.drillPage.toggleExpandCardSetId(cardSetWithChildrenAndCardCounts.cardSet.id)}>
                        {state.drillPage.expandedCardSetIds.includes(cardSetWithChildrenAndCardCounts.cardSet.id) ?
                            <DashSquareDotted/> :
                            <PlusSquareDotted/>}
                    </div>
                    <TristateCheckbox
                        key={cardSetWithChildrenAndCardCounts.cardSet.id}
                        label={cardSetWithChildrenAndCardCounts.cardSet.name + ' (' + cardSetWithChildrenAndCardCounts.cardCount + ')'}
                        checked={isChecked}
                        indeterminate={isIndeterminate}
                        onChange={() => actions.drillPage.toggleCardSetId(cardSetWithChildrenAndCardCounts.cardSet.id)}
                        id={"cardSetCheckbox_" + cardSetWithChildrenAndCardCounts.cardSet.id}
                        disabled={state.drillPage.formDisabled}
                    />
                </div>
            ) : (
                <div className="d-flex flex-row" style={{marginLeft}}>
                    <div className="me-1 expand-toggle-filler"><DashSquareDotted/></div>
                    <Form.Check
                        key={cardSetWithChildrenAndCardCounts.cardSet.id}
                        type="checkbox"
                        label={cardSetWithChildrenAndCardCounts.cardSet.name + ' (' + cardSetWithChildrenAndCardCounts.cardCount + ')'}
                        checked={isChecked}
                        onChange={() => actions.drillPage.toggleCardSetId(cardSetWithChildrenAndCardCounts.cardSet.id)}
                        id={"cardSetCheckbox_" + cardSetWithChildrenAndCardCounts.cardSet.id}
                        disabled={state.drillPage.formDisabled}
                    />
                </div>
            )}
            {state.drillPage.expandedCardSetIds.includes(cardSetWithChildrenAndCardCounts.cardSet.id) && cardSetWithChildrenAndCardCounts.children.map(child => (
                <CardSetCheckbox key={child.cardSet.id} cardSetWithChildrenAndCardCounts={child} level={level + 1}/>
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
                            {state.page.workspacesWithCardCountsWithCardSetsWithChildrenAndCardCounts.map(wwcs =>
                                <>
                                    <div className="d-flex flex-row">
                                        <div className="mt-2 me-1 expand-toggle" onClick={() => actions.drillPage.toggleExpandWorkspaceId(wwcs.workspaceWithCardCount.workspace.id)}>
                                        {state.drillPage.expandedWorkspaceIds.includes(wwcs.workspaceWithCardCount.workspace.id) ?
                                            <DashSquareDotted/> :
                                            <PlusSquareDotted/>}
                                        </div>
                                        <TristateCheckbox
                                            className="mt-2"
                                            key={wwcs.workspaceWithCardCount.workspace.id}
                                            label={wwcs.workspaceWithCardCount.workspace.name + ' (' + wwcs.workspaceWithCardCount.cardCount + ')'}
                                            checked={state.drillPage.selectedWorkspaceIds.includes(wwcs.workspaceWithCardCount.workspace.id)}
                                            onChange={event => actions.drillPage.toggleWorkspaceId(wwcs.workspaceWithCardCount.workspace.id)}
                                            id={"workspaceCheckbox_"+wwcs.workspaceWithCardCount.workspace.id}
                                            indeterminate={state.drillPage.indeterminateWorkspaceIds.includes(wwcs.workspaceWithCardCount.workspace.id)}
                                            disabled={state.drillPage.formDisabled}
                                        />
                                    </div>
                                    {state.drillPage.expandedWorkspaceIds.includes(wwcs.workspaceWithCardCount.workspace.id) && wwcs.cardSetsWithChildrenAndCardCounts.map(cardSetWithChildrenAndCardCounts =>
                                        <CardSetCheckbox key={cardSetWithChildrenAndCardCounts.cardSet.id} cardSetWithChildrenAndCardCounts={cardSetWithChildrenAndCardCounts} level={1}/>
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