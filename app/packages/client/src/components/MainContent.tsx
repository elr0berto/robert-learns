import {useAppState} from "../overmind";
import {Pages} from "../page-urls";
import SignUp from "./SignUp/SignUp";

function MainContent() {
    const state = useAppState();

    switch(state.page.current) {
        case Pages.SignUp:
            return <SignUp/>;
    }
    return null;
}

export default MainContent;