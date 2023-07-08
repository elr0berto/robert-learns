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
                        {state.error.error !== null && (state.error.error.message?.length ?? 0) > 0 ?
                            <Alert variant="danger">{state.error.error.message}</Alert>
                        : null}
                        <Button onClick={() => actions.error.reloadPage()}>Reload page</Button>
                    </>
                }
            </div>
        </section>
    );
}

export default ErrorPage;