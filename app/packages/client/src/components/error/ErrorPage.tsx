import React from "react";
import {useActions, useAppState} from '../../overmind';
import {Alert, Button} from "react-bootstrap";

function ErrorPage() {
    const actions = useActions();
    const state = useAppState();
    return (
        <section className="error-section mt-3">
            <div className="container">
                {state.error.reloadingPage ?
                    <div className="error-text">Please wait while page reloads...</div> :
                    <>
                        <Alert variant="danger">Unexpected error.</Alert>
                        <Button onClick={() => actions.error.reloadPage()}>Reload page</Button>
                    </>
                }
            </div>
        </section>
    );
}

export default ErrorPage;