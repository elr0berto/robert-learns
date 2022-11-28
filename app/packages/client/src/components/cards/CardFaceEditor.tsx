import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import React from "react";
import htmlToDraft from "html-to-draftjs";
import {ContentState, EditorState} from "draft-js";

type Props = {
    onHtmlChange: (html: string) => void;
};

function CardFaceEditor(props: Props) {
    return <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onContentStateChange={contentState => props.onHtmlChange(draftToHtml(contentState))}
        toolbar={{
            image: {
                uploadEnabled: true,
                uploadCallback: async (file: object) => { console.log('file', file); return { data: { link : '/blah.jpg'} }; }
            }
        }}
    />;
}

export default CardFaceEditor;