import React from 'react';

type Props = {
    content: string | null;
}

function CardPreviewFace(props: Props) {
    return <div className="card-preview-face">
        {props.content ?? ''}
    </div>;
}

export default CardPreviewFace;