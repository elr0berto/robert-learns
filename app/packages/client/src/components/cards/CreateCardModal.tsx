import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Container, Form, Modal, Tab, Tabs} from "react-bootstrap";
import React from "react";
import CardFaceEditor from "./CardFaceEditor";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function CreateCardModal() {
    const state = useAppState();
    const actions = useActions();

    if (!state.createCardModal.isOpen) {
        return null;
    }

    return (
        <Modal fullscreen={true} size="xl" show={true} onHide={() => actions.createCardModal.closeCreateCardModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Create a new card!</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Form>
                        <Tabs
                            activeKey={state.createCardModal.activeTab ?? 'front'}
                            onSelect={(k: any) => actions.createCardModal.setActiveTab(k)}
                            className="mb-3"
                        >
                            <Tab eventKey="front" title="Front">
                                <CardFaceEditor
                                    onHtmlChange={html => actions.createCardModal.setFrontHtml(html)}
                                    uploadCallback={file => actions.createCardModal.uploadFile(file)}
                                />
                            </Tab>
                            <Tab eventKey="back" title="Back">
                                <CardFaceEditor
                                    onHtmlChange={html => actions.createCardModal.setBackHtml(html)}
                                    uploadCallback={file => actions.createCardModal.uploadFile(file)}
                                />
                            </Tab>
                            <Tab eventKey="audio" title="Audio">
                                <Form.Group controlId="formFileLg" className="mb-3">
                                    <Form.Label>Upload audio</Form.Label>
                                    <Form.Control type="file" size="lg" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        console.log('e', e);
                                        console.log('objUrl', URL.createObjectURL(e.target.files![0]));
                                        actions.createCardModal.setAudioFile((e.target?.files?.length ?? 0) > 0 ? e.target!.files![0] : null); }} accept=".mp3,.aac,.m4a"/>
                                </Form.Group>
                                {state.createCardModal.audioFileDataURL !== null ? <AudioPlayer
                                    src={state.createCardModal.audioFileDataURL}
                                    onPlay={e => console.log("onPlay")}
                                /> : null}
                            </Tab>
                        </Tabs>
                        {state.workspaceCardSetCreate.form.showErrors ? <Alert variant="danger">{state.workspaceCardSetCreate.form.allErrors.map((err: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined, i: React.Key | null | undefined) => <p key={i}>{err}</p>)}</Alert> : null}
                    </Form>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => actions.createCardModal.closeCreateCardModal()}>Close</Button>
                <Button variant="primary" onClick={() => actions.createCardModal.submit()}>Save card!</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateCardModal;