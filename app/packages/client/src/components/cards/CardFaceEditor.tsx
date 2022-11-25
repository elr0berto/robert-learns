import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import React from "react";

type Props = {
    onHtmlChange: (html: string) => void;
};

function CardFaceEditor(props: Props) {
    return <Editor
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        initialContentState={}
        onContentStateChange={contentState => props.onHtmlChange(draftToHtml(contentState))}
    />;
}

export default CardFaceEditor;