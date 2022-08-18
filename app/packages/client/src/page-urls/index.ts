import Workspace from "@elr0berto/robert-learns-shared/dist/api/models/Workspace";
import {overmind} from "../index";

export enum Pages {
    Front = "Front",
    SignIn = "SignIn",
    SignUp = "SignUp",
    Workspace = "Workspace",
    WorkspaceCreate = "WorkspaceCreate",
}

type PageUrlConfig = {
    route: string;
    url: (params?: any) => string;
    page: Pages;
    getRouteCallback: (actions: typeof overmind.actions) => () => void,
}

export type PageUrlConfigKeys = 'front' | 'signIn' | 'signUp' | 'workspace' | 'workspaceCreate';
type PageUrlConfigs = {
    [name in PageUrlConfigKeys]: PageUrlConfig;
}

/*
    effects.page.router.initialize({
        [pageUrls.front.route]: actions.page.showFrontPage,
        [pageUrls.signIn.route]: actions.page.showSignInPage,
        [pageUrls.signUp.route]: actions.page.showSignUpPage,
        [pageUrls.workspace.route]: actions.page.showWorkspacePage,
        [pageUrls.workspaceCreate.route]: actions.page.showWorkspaceCreatePage,
    });
 */
const pageUrls : PageUrlConfigs = {
    front: {
        route: '/',
        url: () => '/',
        page: Pages.Front,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showFrontPage,
    },
    signIn: {
        route: '/sign-in',
        url: () => '/sign-in',
        page: Pages.SignIn,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showSignInPage,
    },
    signUp: {
        route: '/sign-up',
        url: () => '/sign-up',
        page: Pages.SignUp,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showSignUpPage,
    },
    workspace: {
        route: '/workspace/:id',
        url: (workspace: Workspace) => '/workspace/'+workspace.id,
        page: Pages.Workspace,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showWorkspacePage,
    },
    workspaceCreate: {
        route: '/workspace-create',
        url: () => '/workspace-create',
        page: Pages.WorkspaceCreate,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showWorkspaceCreatePage,
    }
}

export { pageUrls }