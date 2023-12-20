import React from 'react';
import {Col, Row, Spinner} from "react-bootstrap";

function Loading(props: {text?: string}) {
    return <Row className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '100px' }}>
        <Col className="d-flex flex-column align-items-center">
            <Spinner animation="grow" className="mb-3"/>
            <div>{props.text ?? 'Loading...'}</div>
        </Col>
    </Row>;
}

export default Loading;