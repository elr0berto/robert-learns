import {Button} from "react-bootstrap";

import {useActions, useAppState} from "../../overmind";
import {Facebook} from "react-bootstrap-icons";
import {SignInStatus} from "../../overmind/sign-in/sign-in-state";

function FacebookLoginButton() {
    const actions = useActions();
    const state = useAppState();

    return <Button
        variant={'outline-primary'}
        onClick={actions.signIn.facebookSignIn}
        disabled={state.signIn.status !== SignInStatus.Idle}
    >
        <Facebook/> Sign in with Facebook
    </Button>;
}

export default FacebookLoginButton;