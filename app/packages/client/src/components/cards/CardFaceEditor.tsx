import React from 'react';
import Editor from '../Editor';

type Props = {
    onChange: (html: string) => void;
    uploadCallback: (file: File) => Promise<string>;
    value: string;
};

function CardFaceEditor(props: Props) {
    return <Editor
        initialValue={props.value}
        onChange={props.onChange}
        uploadCallback={props.uploadCallback}
        //defaultEditorState={editorState}
        //toolbarClassName="toolbarClassName"
        //wrapperClassName="wrapperClassName"
        //editorClassName="editorClassName"
        //onEditorStateChange={onEditorStateChange}
        //toolbar={{
        //    image: {
        //        uploadEnabled: true,
        //        uploadCallback: async (file: File) => { const url = await uploadCallback(file); return {data:{link:url}}; }
        //    }
        //}}
    />;
}

export default CardFaceEditor;
