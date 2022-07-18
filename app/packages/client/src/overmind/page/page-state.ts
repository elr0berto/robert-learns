export enum Pages {
    Front = "Front",
    Login = "Login",
    Register = "Register",
}

type PageState = {
    current: Pages | null;
}

export const state: PageState = {
    current: null,
};