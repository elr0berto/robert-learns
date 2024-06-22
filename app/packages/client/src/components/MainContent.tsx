import {useAppState} from "../overmind";
import {pageUrls} from "../page-urls";
import {Container} from "react-bootstrap";

function MainContent() {
    const state = useAppState();

    if (state.page.page === null) {
        return null;
    }

    if (state.page.initializing) {
        return <Container className="my-5">Initializing...</Container>;
    }

    // @ts-ignore
    if (typeof pageUrls[state.page.page] === 'object') {
        // @ts-ignore
        const PageComponent = pageUrls[state.page.page].getPageComponent();
        if (PageComponent === null) {
            return null;
        }
        return <PageComponent/>;
    }

    return null;
}

export default MainContent;