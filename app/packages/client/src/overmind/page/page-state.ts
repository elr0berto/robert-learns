export enum Pages {
    Front = "Front",
}

type PageState = {
    current: Pages | null;
}

export const state: PageState = {
    current: null,
};