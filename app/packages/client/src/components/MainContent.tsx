import {useAppState} from "../overmind";
import {pageUrls} from "../page-urls";

function MainContent() {
    const state = useAppState();

    if (state.page.current === null) {
        return null;
    }

    if (typeof pageUrls[state.page.current!] === 'object') {
        const pageComponent = pageUrls[state.page.current!].getPageComponent();
        if (pageComponent === null) {
            return null;
        }
        return pageComponent();
    }

    return null;
}

export default MainContent;