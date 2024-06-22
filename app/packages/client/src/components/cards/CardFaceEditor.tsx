import React, {useRef} from 'react';
import Editor, {EditorInstance} from '../Editor';

type Props = {
    uploadCallback: (file: File) => Promise<string>;
    initialValue: string;
};

const CardFaceEditor = React.forwardRef<EditorInstance, Props>((props: Props, ref: React.Ref<any>) => {
    const editorRef = useRef<EditorInstance | null>(null);

    React.useImperativeHandle(ref, () => ({
        getContent: () => {
            return editorRef.current?.getContent();
        }
    }));

    return <Editor
        ref={editorRef}
        initialValue={props.initialValue}
        uploadCallback={props.uploadCallback}
    />;
});

export default CardFaceEditor;
