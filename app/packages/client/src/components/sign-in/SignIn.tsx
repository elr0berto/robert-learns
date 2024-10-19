import { Container} from "react-bootstrap";
import SignInForm from "./SignInForm";
import {pageUrls} from "../../page-urls";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {FacebookProvider} from 'react-facebook';

import {useActions, useAppState} from "../../overmind";
import FacebookLoginButton from "./FacebookLoginButton";

function SignIn() {
    const actions = useActions();
    const state = useAppState();

    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
        throw new Error('REACT_APP_GOOGLE_CLIENT_ID is not set in the environment (.env)');
    }
    if (!process.env.REACT_APP_FACEBOOK_APP_ID) {
        throw new Error('REACT_APP_FACEBOOK_APP_ID is not set in the environment (.env)');
    }
    if (state.signIn.user !== null) {
        return <Container>
            <h1 className="my-5">You are already signed in</h1>
        </Container>;
    }
    return <Container>
        <h1 className="my-5">Sign In</h1>
        <SignInForm/>

        <hr/>
        <div className="mt-3 col-2">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={resp => actions.signIn.googleSignIn(resp.credential)}
                    onError={() => {
                        throw new Error('Google login failed')
                    }}
                />
            </GoogleOAuthProvider>
        </div>

        <div className="mt-3 col-2">
            <FacebookProvider
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            >
                <FacebookLoginButton/>
            </FacebookProvider>
        </div>

        <div className="mt-3">Don't have an account? <a href={pageUrls.signUp.url()}>Sign up</a></div>
    </Container>;
}

export default SignIn;