import React from "react";
import {useActions, useAppState} from '../../overmind';
import {Button} from "react-bootstrap";

function ErrorPage() {
    const actions = useActions();
    const state = useAppState();
    return (
        <section className="error-section">
            <div className="container">
                {state.error.reloadingPage ?
                    <div className="error-text">Please wait while page reloads...</div> :
                    <>
                        <div className="error-text">Unexpected error.</div>
                        <Button onClick={() => actions.error.reloadPage()}>Reload page</Button>
                    </>
                }
            </div>
        </section>
    );
}

export default ErrorPage;