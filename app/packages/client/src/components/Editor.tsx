import React, { useCallback, useRef, useState } from 'react';
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";

type Props = {
    initialValue: string;
    onChange: (html: string) => void;
    uploadCallback: (file: File) => Promise<string>;
}

function Editor(props: Props) {
    console.log('Editor props', props);
    const [value, setValue] = useState<string>(props.initialValue ?? '');
    const reactQuillRef = useRef<ReactQuill>(null);

    const onChange = (content: string) => {
        console.log('onChange content:', content);
        setValue(content);

        if (props.onChange) {
            props.onChange(content);
        }
    };

    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = async () => {
            if (input !== null && input.files !== null) {
                const file = input.files[0];
                const url = await props.uploadCallback(file);
                const quill = reactQuillRef.current;
                if (quill) {
                    const range = quill.getEditorSelection();
                    range && quill.getEditor().insertEmbed(range.index, "image", url);
                }
            }
        };
    }, []);

    return (
        <ReactQuill
            ref={reactQuillRef}
            theme="snow"
            placeholder="Start writing..."
            modules={{
                toolbar: {
                    container: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                            { list: "ordered" },
                            { list: "bullet" },
                            { indent: "-1" },
                            { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["code-block"],
                        ["clean"],
                    ],
                    handlers: {
                        image: imageHandler,
                    },
                },
                clipboard: {
                    matchVisual: false,
                },
            }}
            formats={[
                "header",
                "font",
                "size",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "indent",
                "link",
                "image",
                "video",
                "code-block",
            ]}
            value={value}
            onChange={onChange}
        />
    );
}


export default Editor;
