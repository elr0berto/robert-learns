import {Button, Container} from "react-bootstrap";
import SignUpForm from "./SignUpForm";
import {useActions, useAppState} from "../../overmind";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {FacebookProvider, LoginButton, LoginStatus} from "react-facebook";
import {Facebook} from "react-bootstrap-icons";
import {pageUrls} from "../../page-urls";

function SignUp() {
    const state = useAppState();
    const actions = useActions();

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
        <h1 className="my-5">Sign up</h1>

        <SignUpForm/>
        <hr/>
        <div className="mb-3 col-2">
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
            <FacebookProvider appId={process.env.REACT_APP_FACEBOOK_APP_ID}>
                <LoginButton
                    scope="email,public_profile"
                    onSuccess={resp => actions.signIn.facebookSignIn(resp && resp.status === LoginStatus.CONNECTED ? resp.authResponse.accessToken : undefined)}
                    onError={err => {
                        throw err;
                    }}
                    asChild={Button}
                >
                    <Facebook/> Sign in with Facebook
                </LoginButton>
            </FacebookProvider>
        </div>

        <div className="mt-3">Already have an account? <a href={pageUrls.signIn.url()}>Sign in</a></div>
    </Container>;
}

export default SignUp;