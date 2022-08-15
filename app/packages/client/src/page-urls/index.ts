import Workspace from "@elr0berto/robert-learns-shared/dist/api/models/Workspace";

export enum Pages {
    Front = "Front",
    SignIn = "SignIn",
    SignUp = "SignUp",
    Workspace = "Workspace",
    WorkspaceCreate = "WorkspaceCreate",
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
        url: function(workspace: Workspace) {
            return '/workspace/'+workspace.id;
        },
        page: Pages.Workspace,
    },
    workspaceCreate: {
        route: '/workspace-create',
        url: function() {
            return '/workspace-create';
        },
        page: Pages.WorkspaceCreate,
    }
}

export { pageUrls }