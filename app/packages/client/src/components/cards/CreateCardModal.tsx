import {useActions, useAppState} from "../../overmind";
import {Alert, Button, Container, Form, Modal, Tab, Tabs} from "react-bootstrap";
import React, {useCallback, useRef} from "react";
import CardFaceEditor from "./CardFaceEditor";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {EditorInstance} from "../Editor";

function CreateCardModal() {
    const state = useAppState();
    const actions = useActions();

    const { uploadFile } = actions.createCardModal;
    const uploadCallback = useCallback((file: File) => {
        return uploadFile(file);
    }, [uploadFile]);

    const frontEditorRef = useRef<EditorInstance | null>(null);
    const backEditorRef = useRef<EditorInstance | null>(null);

    const saveEditorContentState = () => {
        const frontContent = frontEditorRef.current?.getContent();
        const backContent = backEditorRef.current?.getContent();

        if (frontContent !== null && frontContent !== undefined) {
            actions.createCardModal.setFrontHtml(frontContent ?? ''); // if tab was not open the editor will be null so then we should not set the content because the content will come from the cards initial state / loaded state
        }
        if (backContent !== null && backContent !== undefined) {
            actions.createCardModal.setBackHtml(backContent ?? ''); // if tab was not open the editor will be null so then we should not set the content because the content will come from the cards initial state / loaded state
        }
    }

    // 👇️ create a ref for the file input
    const inputRef = useRef<HTMLInputElement>(null);
    const resetFileInput = () => {
        if (inputRef?.current !== null) {
            // 👇️ reset input value
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
                            unmountOnExit={false}
                            mountOnEnter={true}
                            activeKey={state.createCardModal.activeTab ?? 'front'}
                            onSelect={(k: any) => { actions.createCardModal.setActiveTab(k)}}
                            className="mb-3"
                        >
                            <Tab eventKey="front" title="Front">
                                <CardFaceEditor
                                    ref={frontEditorRef}
                                    initialValue={state.createCardModal.frontHtml}
                                    uploadCallback={uploadCallback}
                                />
                            </Tab>
                            <Tab eventKey="back" title="Back">
                                <CardFaceEditor
                                    ref={backEditorRef}
                                    initialValue={state.createCardModal.backHtml}
                                    uploadCallback={uploadCallback}
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
                                    />
                                    <Button variant={"danger"} onClick={() => { resetFileInput(); actions.createCardModal.setAudioFile(null); }}>Remove audio</Button>
                                </> : null}
                            </Tab>
                        </Tabs>
                        <div className={state.createCardModal.activeTab === 'front' ? '' : 'd-none'}>

                        </div>
                        <div className={state.createCardModal.activeTab === 'back' ? '' : 'd-none'}>

                        </div>
                        {state.createCardModal.submitError !== null ? <Alert variant={'danger'}>{state.createCardModal.submitError}</Alert> : null}
                    </Form>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Button disabled={state.createCardModal.submitting} variant="secondary" onClick={() => actions.createCardModal.closeCreateCardModal()}>Close</Button>
                <Button disabled={state.createCardModal.submitting} variant="primary" onClick={() => {saveEditorContentState(); actions.createCardModal.submit()}}>Save card!</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateCardModal;