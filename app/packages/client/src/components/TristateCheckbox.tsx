import React, {useEffect, useRef} from 'react';
import {Form} from "react-bootstrap";

type TristateCheckboxProps = {
    id: string,
    className?: string,
    label: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    indeterminate: boolean,
    disabled: boolean,
    style?: React.CSSProperties,
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
        style={props.style}
        className={props.className}
        type="checkbox"
        label={props.label}
        checked={props.checked}
        onChange={props.onChange}
        ref={checkboxRef}
        disabled={props.disabled}
    />
}

export default TristateCheckbox;