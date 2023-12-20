import React from 'react';
import {useActions, useAppState} from "../overmind";
import {Container, Toast, ToastContainer} from "react-bootstrap";
import {SignInStatus} from "../overmind/sign-in/sign-in-state";
import MainContent from "./MainContent";
import ErrorBoundary from "./error/ErrorBoundary";
import TopMenu from "./TopMenu";
import CreateCardModal from "./cards/CreateCardModal";
import Loading from "./Loading";

function AppInner() {
    const state = useAppState();
    const actions = useActions();
    console.log('state.signIn.status', state.signIn.status);
    console.log('state.signIn.user', state.signIn.user);

    if (state.signIn.status === SignInStatus.Checking) {
        return <Container>
            <Loading/>
        </Container>;
    }

    return <>
        <TopMenu/>
        <MainContent/>
        <CreateCardModal/>
        <ToastContainer position={'top-center'}>
            {state.notifications.notificationsWithId.map(notification =>
            <Toast key={notification.id} onClose={() => actions.notifications.closeNotification(notification.id)}>
                <Toast.Header>
                    <strong className="mr-auto">Notification</strong>
                </Toast.Header>
                <Toast.Body>{notification.notification.message}</Toast.Body>
            </Toast>
            )}
        </ToastContainer>
    </>;
}

function App() {
    const state = useAppState();
    const actions = useActions();

    return <ErrorBoundary errorActions={actions.error} errorState={state.error}>
        <AppInner/>
    </ErrorBoundary>;
}

export default App;