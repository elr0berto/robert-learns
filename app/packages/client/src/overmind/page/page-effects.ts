import page from 'page';
import queryString from 'query-string';

export const router = {
    initialize(routes: { [url: string]: (payload: {params: object, querystring: queryString.ParsedQuery<string>}) => void }) {
        Object.keys(routes).forEach(url => {
            page(url, ({ params, querystring }) => {
                const payload = { params, querystring: queryString.parse(querystring) };
                routes[url](payload);
            })
        })
        //page.base('/');
        page.start();
    },
    goTo(url: string) {
        page.show(url);
    },
    open(url: string) {
        page.show(url);
    },
    redirect(url: string) {
        page.redirect(url);
    },
};

export const reloadPage = () => {
    window.location.reload();
}