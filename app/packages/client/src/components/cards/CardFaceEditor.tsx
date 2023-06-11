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
    />;
}

export default CardFaceEditor;
