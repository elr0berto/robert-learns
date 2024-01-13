import React, {useEffect, useRef, useState} from 'react';
import {Form} from "react-bootstrap";

type TristateCheckboxProps = {
    id: string,
    className?: string,
    label: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    indeterminate: boolean,
}
function TristateCheckbox(props: TristateCheckboxProps) {
    const checkboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = props.indeterminate;
        }
    }, [props.indeterminate]);

    return <Form.Check
        id={props.id}
        className={props.className}
        type="checkbox"
        label={props.label}
        checked={props.checked}
        onChange={props.onChange}
        ref={checkboxRef}
    />
}

export default TristateCheckbox;