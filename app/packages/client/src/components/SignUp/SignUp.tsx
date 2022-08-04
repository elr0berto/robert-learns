import {Container} from "react-bootstrap";
import SignUpForm from "./SignUpForm";

function SignUp() {
    return <Container>
        <h1 className="my-5">Sign up</h1>
        <SignUpForm/>
    </Container>;
}

export default SignUp;