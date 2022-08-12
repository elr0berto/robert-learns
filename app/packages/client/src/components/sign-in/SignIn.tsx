import {Container} from "react-bootstrap";
import SignInForm from "./SignInForm";
import {pageUrls} from "../../page-urls";

function SignIn() {
    return <Container>
        <h1 className="my-5">Sign In</h1>
        <SignInForm/>
        <div className="mt-3">Don't have an account? <a href={pageUrls.signUp.url()}>Sign up</a></div>
    </Container>;
}

export default SignIn;