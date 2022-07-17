export enum Pages {
    Front = "Front",
    Register = "Register",
}

type PageState = {
    current: Pages | null;
}

export const state: PageState = {
    current: null,
};