import {Form} from "react-bootstrap";

function SignUpForm() {
    return <Form className="col-lg-5">
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value="nu"/>
            <Form.Text className="text-muted">
                We'll never share your email with anyone else.
            </Form.Text>
        </Form.Group>
    </Form>;
}
export default SignUpForm;