import React from 'react';
import { useQuill } from 'react-quilljs';

type Props = {
    initialValue: string;
    onChange: (html: string) => void;
    uploadCallback: (file: File) => Promise<string>;
}

function Editor(props: Props) {
    const { quill, quillRef } = useQuill();

    // Insert Image(selected by user) to quill
    const insertToEditor = (url: string) => {
        const range = quill!.getSelection();
        quill!.insertEmbed(range!.index, 'image', url);
    };


    // Open Dialog to select Image File
    const selectLocalImage = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files![0];
            const url = await props.uploadCallback(file);
            insertToEditor(url);
        };
    };

    React.useEffect(() => {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(props.initialValue);
            quill.on('text-change', (delta, oldDelta, source) => {
                props.onChange(quill.root.innerHTML);
            });
            quill.getModule('toolbar').addHandler('image', selectLocalImage);
        }
    }, [quill]);

    return (
        <div ref={quillRef} />
    );
}

export default Editor;