import {Alert, Button, Form} from "react-bootstrap";
import {useActions, useAppState} from "../../overmind";
import React from "react";

function SignUpForm() {
    const state = useAppState();
    const actions = useActions();

    return <Form className="col-lg-5">
        <Form.Group className="mb-3" controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" value={state.signUp.firstName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.signUp.changeFirstName(event.currentTarget.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter last name" value={state.signUp.lastName} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.signUp.changeLastName(event.currentTarget.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={state.signUp.username} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.signUp.changeUsername(event.currentTarget.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={state.signUp.email} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.signUp.changeEmail(event.currentTarget.value)}/>
            <Form.Text className="text-muted">
                We'll never share your email with anyone else.
            </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword1">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" value={state.signUp.password1} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.signUp.changePassword1(event.currentTarget.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword2">
            <Form.Label>Password (again)</Form.Label>
            <Form.Control type="password" placeholder="Enter password again" value={state.signUp.password2} onChange={(event: React.ChangeEvent<HTMLInputElement>) => actions.signUp.changePassword2(event.currentTarget.value)}/>
        </Form.Group>
        {state.signUp.showErrors ? <Alert variant="danger">{state.signUp.allErrors.map((err,i) => <p key={i}>{err}</p>)}</Alert> : null}
        <Button disabled={state.signUp.submitDisabled} onClick={() => actions.signUp.submit()}>Sign up</Button>
    </Form>;
}
export default SignUpForm;