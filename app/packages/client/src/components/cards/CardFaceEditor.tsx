import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React from "react";
import {EditorState, convertFromRaw, RawDraftContentState} from "draft-js";

type Props = {
    onEditorStateChange: (editorState: EditorState) => void;
    uploadCallback: (file: File) => Promise<string>;
    editorState: EditorState;
};

function CardFaceEditor(props: Props) {
    const onContentStateChange = (contentState : RawDraftContentState) => {
        const newEditorState = EditorState.push(props.editorState, convertFromRaw(contentState), 'apply-entity');
        props.onEditorStateChange(newEditorState);
    };
    return <Editor
        editorState={props.editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onContentStateChange={onContentStateChange}
        toolbar={{
            image: {
                uploadEnabled: true,
                uploadCallback: async (file: File) => { const url = await props.uploadCallback(file); return {data:{link:url}}; }
            }
        }}
    />;
}

export default CardFaceEditor;