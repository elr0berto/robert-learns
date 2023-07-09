import React, { useEffect, useCallback } from 'react';
import { useQuill } from 'react-quilljs';

type Props = {
    initialValue: string;
    onChange: (html: string) => void;
    uploadCallback: (file: File) => Promise<string>;
}

function Editor({ initialValue, onChange, uploadCallback }: Props) {
    const { quill, quillRef } = useQuill();

    const insertToEditor = useCallback((url: string) => {
        if (!quill) {
            throw new Error('quill is undefined or null');
        }
        const range = quill.getSelection();
        if (range === null) {
            throw new Error('range is null');
        }
        quill.insertEmbed(range.index, 'image', url);
    }, [quill]);

    const selectLocalImage = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            if (!input.files) {
                throw new Error('input.files is null or undefined');
            }
            const file = input.files[0];
            const url = await uploadCallback(file);
            insertToEditor(url);
        };
    }, [uploadCallback, insertToEditor]);

    useEffect(() => {
        if (quill) {
            quill.clipboard.dangerouslyPasteHTML(initialValue);
            quill.on('text-change', (delta, oldDelta, source) => {
                onChange(quill.root.innerHTML);
            });
            quill.getModule('toolbar').addHandler('image', selectLocalImage);
        }
    }, [quill, initialValue, onChange, selectLocalImage]);

    return (
        <div ref={quillRef} />
    );
}

export default Editor;
