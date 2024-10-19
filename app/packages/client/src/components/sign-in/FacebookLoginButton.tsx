import {Button} from "react-bootstrap";
import {LoginButton, LoginStatus, useFacebook} from 'react-facebook';
import {Facebook} from 'react-bootstrap-icons';

import {useActions} from "../../overmind";

function FacebookLoginButton() {
    const actions = useActions();
    const fb = useFacebook();

    return <LoginButton
        scope="email,public_profile"
        onSuccess={resp => actions.signIn.facebookSignIn(resp && resp.status === LoginStatus.CONNECTED ? resp.authResponse.accessToken : undefined)}
        onError={err => {
            throw err;
        }}
        asChild={Button}
        disabled={!fb.api || fb.isLoading}
    >
        <Facebook/> Sign in with Facebook
    </LoginButton>;
}

export default FacebookLoginButton;