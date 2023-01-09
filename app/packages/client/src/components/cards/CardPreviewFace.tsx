import React from 'react';

type Props = {
    content: string | null;
}

function CardPreviewFace(props: Props) {
    return <div className="card-preview-face" dangerouslySetInnerHTML={{__html: props.content ?? ''}}/>;
}

export default CardPreviewFace;