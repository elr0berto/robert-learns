import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import React from "react";
import htmlToDraft from "html-to-draftjs";
import {ContentState, EditorState} from "draft-js";

const htmlToDraftBlocks = (html: string) => {
    const blocksFromHtml = htmlToDraft(html);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    return EditorState.createWithContent(contentState);
}

type Props = {
    onHtmlChange: (html: string) => void;
    uploadCallback: (file: File) => Promise<string>;
    initialHtml: string | null;
};

function CardFaceEditor(props: Props) {
    return <Editor
        editorState={props.initialHtml === null ? EditorState.createEmpty() : htmlToDraftBlocks(props.initialHtml)}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onContentStateChange={contentState => props.onHtmlChange(draftToHtml(contentState))}
        toolbar={{
            image: {
                uploadEnabled: true,
                uploadCallback: async (file: File) => { const url = await props.uploadCallback(file); return {data:{link:url}}; }
            }
        }}
    />;
}

export default CardFaceEditor;