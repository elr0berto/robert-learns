import React from 'react';

type Props = {
    content: string | null;
}

function CardPreviewFace(props: Props) {
    return <div className="card-preview-face ql-editor" dangerouslySetInnerHTML={{__html: props.content ?? ''}}/>;
}

export default CardPreviewFace;