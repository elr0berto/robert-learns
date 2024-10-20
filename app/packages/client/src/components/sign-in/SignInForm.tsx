import {Alert, Button, Form} from "react-bootstrap";
import {useActions, useAppState} from "../../overmind";
import React from "react";

function SignInForm() {
    const state = useAppState();
    const actions = useActions();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!state.signIn.signInForm.submitDisabled) {
            actions.signIn.submit();
        }
    };

    return <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username/Email</Form.Label>
            <Form.Control type="text" placeholder="Enter username or email" value={state.signIn.signInForm.username} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.signIn.changeSignInFormUsername(event.currentTarget.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={state.signIn.signInForm.password} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.signIn.changeSignInFormPassword(event.currentTarget.value)}/>
        </Form.Group>
        {state.signIn.signInForm.showErrors ? <Alert variant="danger">{state.signIn.signInForm.allErrors.map((err,i) => <p key={i}>{err}</p>)}</Alert> : null}
        <Button disabled={state.signIn.signInForm.submitDisabled} type="submit">Sign in</Button>
    </Form>;
}
export default SignInForm;