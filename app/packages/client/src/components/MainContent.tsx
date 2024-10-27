import {useAppState} from "../overmind";
import {pageUrls} from "../page-urls";
import {Container} from "react-bootstrap";

function MainContent() {
    const state = useAppState();



    if (state.page.initializing) {
        return <Container className="my-5">Initializing...</Container>;
    }

    if (state.page.page === null) {
        return <Container>
            <h1 className="my-5">Page not found</h1>
            <p>The requested page was not found.</p>
        </Container>;
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

    return <Container>
        <h1 className="my-5">Page not found</h1>
        <p>The requested page was not found.</p>
    </Container>;;
}

export default MainContent;