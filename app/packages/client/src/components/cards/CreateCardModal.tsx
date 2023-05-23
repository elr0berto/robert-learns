import {useActions, useAppState} from "../../overmind";
import {Button, Container, Form, Modal, Tab, Tabs} from "react-bootstrap";
import React, {useRef} from "react";
import CardFaceEditor from "./CardFaceEditor";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function CreateCardModal() {
    const state = useAppState();
    const actions = useActions();

    // 👇️ create a ref for the file input
    const inputRef = useRef<HTMLInputElement>(null);
    const resetFileInput = () => {
        if (inputRef?.current !== null) {
            // 👇️ reset input value
            console.log('resetting input');
            inputRef.current.value = '';
        }
    };

    if (!state.createCardModal.isOpen) {
        return null;
    }

    const edit = state.createCardModal.edit;

    return (
        <Modal fullscreen={true} size="xl" show={true} onHide={() => actions.createCardModal.closeCreateCardModal()}>
            <Modal.Header closeButton>
                <Modal.Title>{edit ? 'Edit card' : 'Create a new card!'}</Modal.Title>
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
                                    editorState={state.createCardModal.frontEditorState}
                                    onEditorStateChange={editorState => actions.createCardModal.setFrontEditorState(editorState)}
                                    uploadCallback={file => actions.createCardModal.uploadFile(file)}
                                />
                            </Tab>
                            <Tab eventKey="back" title="Back">
                                <CardFaceEditor
                                    editorState={state.createCardModal.backEditorState}
                                    onEditorStateChange={editorState => actions.createCardModal.setBackEditorState(editorState)}
                                    uploadCallback={file => actions.createCardModal.uploadFile(file)}
                                />
                            </Tab>
                            <Tab eventKey="audio" title="Audio">
                                <Form.Group controlId="formFileLg" className="mb-3">
                                    <Form.Label>Upload audio</Form.Label>
                                    <input className={state.createCardModal.audioFileDataURL !== null ? 'd-none' : ''} ref={inputRef} type="file" onChange={e => {
                                        if (e.target.files && e.target.files.length === 1) {
                                            actions.createCardModal.setAudioFile(e.target.files[0])
                                        } else {
                                            actions.createCardModal.setAudioFile(null)
                                        }
                                    }} accept=".mp3,.aac,.m4a"/>
                                </Form.Group>
                                {state.createCardModal.audioFileDataURL !== null ? <>
                                    <AudioPlayer
                                        src={state.createCardModal.audioFileDataURL}
                                        onPlay={e => console.log("onPlay")}
                                    />
                                    <Button variant={"danger"} onClick={() => { resetFileInput(); actions.createCardModal.setAudioFile(null); }}>Remove audio</Button>
                                </> : null}
                            </Tab>
                        </Tabs>
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