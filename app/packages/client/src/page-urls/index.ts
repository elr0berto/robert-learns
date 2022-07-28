export enum Pages {
    Front = "Front",
    SignIn = "SignIn",
    SignUp = "SignUp",
    Workspace = "Workspace",
}

const pageUrls = {
    front: {
        route: '/',
        url: function() {
            return '/';
        },
        page: Pages.Front,
    },
    signIn: {
        route: '/sign-in',
        url: function() {
            return '/sign-in';
        },
        page: Pages.SignIn,
    },
    signUp: {
        route: '/sign-up',
        url: function() {
            return '/sign-up';
        },
        page: Pages.SignUp,
    },
    workspace: {
        route: '/workspace/:id',
        url: function(id: number) {
            return '/workspace/:id';
        },
        page: Pages.Workspace,
    }
}

export { pageUrls }