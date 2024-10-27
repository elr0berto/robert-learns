import {useAppState} from "../../overmind";
import { Container } from "react-bootstrap";
import React from "react";
import Loading from "../Loading";

function VerifyEmailPage() {
    const state = useAppState();

    if (state.verifyEmailPage.verifying) {
        return <Container><Loading text="Verifying email..."/></Container>;
    }

    if (state.verifyEmailPage.errorMessage) {
        return <Container>
            <h1 className="my-5">Error verifying email</h1>
            <div className="alert alert-danger">
                <p>{state.verifyEmailPage.errorMessage}</p>
            </div>
        </Container>;
    }

    return (
        <Container>
            <h1 className="my-5">Email verification successful</h1>
            <div className="alert alert-success">
                <p>Your email is now verified.</p>
            </div>
        </Container>
    );
}

export default VerifyEmailPage;
