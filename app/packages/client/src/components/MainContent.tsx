import {useAppState} from "../overmind";
import {pageUrls} from "../page-urls";

function MainContent() {
    const state = useAppState();

    console.log('state.page.page', state.page.page);

    if (state.page.page === null) {
        return null;
    }

    // @ts-ignore
    if (typeof pageUrls[state.page.page!] === 'object') {
        // @ts-ignore
        const PageComponent = pageUrls[state.page.page!].getPageComponent();
        if (PageComponent === null) {
            return null;
        }
        return <PageComponent/>;
    }

    return null;
}

export default MainContent;