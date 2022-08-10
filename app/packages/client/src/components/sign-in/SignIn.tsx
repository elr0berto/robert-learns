import {Container} from "react-bootstrap";
import SignInForm from "./SignInForm";

function SignIn() {
    return <Container>
        <h1 className="my-5">Sign In</h1>
        <SignInForm/>
    </Container>;
}

export default SignIn;