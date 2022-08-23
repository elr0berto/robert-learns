import {useAppState} from "../overmind";
import {Pages, pageUrls} from "../page-urls";
import SignUp from "./sign-up/SignUp";
import SignIn from "./sign-in/SignIn";
import WorkspaceCreate from "./workspace/WorkspaceCreate";

function MainContent() {
    const state = useAppState();

    if (state.page.current === null) {
        return null;
    }
    console.log('maincontent', state.page.current);
    if (typeof pageUrls[state.page.current!] === 'object') {
        const pageComponent = pageUrls[state.page.current!].getPageComponent();
        if (pageComponent === null) {
            return null;
        }
        return pageComponent();
    }
    /*switch(state.page.current) {
        case Pages.SignUp:
            return <SignUp/>;
        case Pages.SignIn:
            return <SignIn/>;
        case Pages.WorkspaceCreate:
            return <WorkspaceCreate/>;
    }*/
    return null;
}

export default MainContent;