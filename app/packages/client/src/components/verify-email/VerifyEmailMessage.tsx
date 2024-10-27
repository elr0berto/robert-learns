import {useActions, useAppState} from "../../overmind";
import {SignInStatus} from "../../overmind/sign-in/sign-in-state";

function VerifyEmailMessage() {
    const state = useAppState();
    const actions = useActions();

    if (state.signIn.status !== SignInStatus.Idle && state.signIn.status !== SignInStatus.SendingVerificationEmail) {
        return null;
    }

    if (state.signIn.user === null) {
        return null;
    }

    if (state.signIn.user.emailVerified) {
        return null;
    }

    return <div className="alert alert-warning">
        <strong>Warning:</strong> Your email has not been verified. Please check your email for a verification link.
        <button
            disabled={state.signIn.status === SignInStatus.SendingVerificationEmail}
            className="btn btn-link"
            onClick={() => actions.signIn.sendVerificationEmail()}
        >{state.signIn.status === SignInStatus.SendingVerificationEmail ? 'Sending...' : 'Resend verification email'}</button>
    </div>;
}

export default VerifyEmailMessage;