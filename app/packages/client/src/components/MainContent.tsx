import {useAppState} from "../overmind";
import {Pages} from "../page-urls";
import SignUp from "./sign-up/SignUp";
import SignIn from "./sign-in/SignIn";
import WorkspaceCreate from "./workspace/WorkspaceCreate";

function MainContent() {
    const state = useAppState();

    console.log('maincontent', state.page.current);
    switch(state.page.current) {
        case Pages.SignUp:
            return <SignUp/>;
        case Pages.SignIn:
            return <SignIn/>;
        case Pages.WorkspaceCreate:
            return <WorkspaceCreate/>;
    }
    return null;
}

export default MainContent;