/*
https://reactjs.org/docs/error-boundaries.html

NOTE: error boundary have to be a class-component but class components cannot use react hooks so thats why they are passed down as props.
 */

import React, {ErrorInfo} from 'react';
import {ErrorState} from "../../overmind/error/error-state";
import {Context} from '../../overmind';
import ErrorPage from "./ErrorPage";

type Props = {
    children: React.ReactNode;
    errorActions: Context["actions"]["error"]
    errorState: ErrorState;
}

class ErrorBoundary extends React.Component<Props> {
    componentDidCatch(error: Error, info: ErrorInfo) {
        this.setState(null); // this is just to supress a warning. https://github.com/reactjs/reactjs.org/issues/3028
        console.log('error-boundary: ', error);
        this.props.errorActions.setError({error, errorInfo: info});
    }

    render() {
        if (this.props.errorState.error !== null) {
            return <ErrorPage/>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;