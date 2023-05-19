import React from 'react';
import {Editor} from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from 'draft-js';

type Props = {
    onEditorStateChange: (editorState: EditorState) => void;
    uploadCallback: (file: File) => Promise<string>;
    editorState: EditorState;
};

function CardFaceEditor({ editorState, onEditorStateChange, uploadCallback }: Props) {
    return <Editor
        defaultEditorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        toolbar={{
            image: {
                uploadEnabled: true,
                uploadCallback: async (file: File) => { const url = await uploadCallback(file); return {data:{link:url}}; }
            }
        }}
    />;
}

export default CardFaceEditor;
