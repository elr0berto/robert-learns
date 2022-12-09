import {useAppState} from "../overmind";
import {pageUrls} from "../page-urls";

function MainContent() {
    const state = useAppState();

    console.log('state.page.current', state.page.current);

    if (state.page.current === null) {
        return null;
    }

    // @ts-ignore
    if (typeof pageUrls[state.page.current!] === 'object') {
        // @ts-ignore
        const PageComponent = pageUrls[state.page.current!].getPageComponent();
        if (PageComponent === null) {
            return null;
        }
        return <PageComponent/>;
    }

    return null;
}

export default MainContent;