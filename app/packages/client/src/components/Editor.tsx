import React, { useCallback } from 'react';
import { useQuill } from 'react-quilljs';


export type EditorInstance = {
    getContent: () => string;
};

type Props = {
    initialValue: string;
    uploadCallback: (file: File) => Promise<string>;
}

const Editor = React.forwardRef<EditorInstance, Props>((props: Props, ref: React.Ref<any>) => {
    console.log('Editor props', props);
    const { initialValue, uploadCallback } = props;

    const { quill, quillRef } = useQuill();

    // Function to get the content of the editor
    const getContent = useCallback(() => {
        console.log('Editor.tsx getContent');
        if (quill) {
            return quill.root.innerHTML;
        }
        return '';
    }, [quill]);

    // Expose the getContent function to the parent component through the ref
    React.useImperativeHandle(ref, () => ({
        getContent
    }));

    // Insert Image(selected by user) to quill
    const insertToEditor = useCallback((url: string) => {
        if (!quill) {
            throw new Error('quill is undefined|null in insertToEditor');
        }
        const range = quill.getSelection();
        if (!range) {
            throw new Error('range is undefined|null in insertToEditor');
        }
        quill.insertEmbed(range.index, 'image', url);
    }, [quill]);


    // Upload Image to Image Server such as AWS S3, Cloudinary, Cloud Storage, etc..
    const saveToServer = useCallback(async (file: File) => {
        const url = await uploadCallback(file);
        insertToEditor(url);
    }, [uploadCallback, insertToEditor]);


    // Open Dialog to select Image File
    const selectLocalImage = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            if (input && input.files && input.files.length > 0) {
                const file = input.files[0];
                saveToServer(file);
            }
        };
    }, [saveToServer]); // saveToServer is a dependency since it's used inside selectLocalImage


    React.useEffect(() => {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(initialValue);
        }
    }, [quill,initialValue]);

    React.useEffect(() => {
        if (quill) {
            // Add custom handler for Image Upload
            quill.getModule('toolbar').addHandler('image', selectLocalImage);
        }
    }, [quill,selectLocalImage]);

    return (
        <div>
            <div ref={quillRef} />
        </div>
    );
});


export default Editor;
