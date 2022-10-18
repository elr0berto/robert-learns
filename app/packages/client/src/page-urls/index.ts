import Workspace from "@elr0berto/robert-learns-shared/dist/api/models/Workspace";
import {overmind} from "../index";
import SignUp from "../components/sign-up/SignUp";
import SignIn from "../components/sign-in/SignIn";
import WorkspaceCreate from "../components/workspace/WorkspaceCreate";
import WorkspacePage from "../components/workspace/WorkspacePage";
import CardSet from "@elr0berto/robert-learns-shared/dist/api/models/CardSet";

export enum Pages {
    Front = "front",
    SignIn = "signIn",
    SignUp = "signUp",
    Workspace = "workspace",
    WorkspaceCardSet = "workspaceCardSet",
    WorkspaceCreate = "workspaceCreate",
}

const pageUrls = {
    [Pages.Front]: {
        route: '/',
        url: () => '/',
        page: Pages.Front,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showFrontPage,
        getPageComponent: () => null,
    },
    [Pages.SignIn]: {
        route: '/sign-in',
        url: () => '/sign-in',
        page: Pages.SignIn,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showSignInPage,
        getPageComponent: () => SignIn,
    },
    [Pages.SignUp]: {
        route: '/sign-up',
        url: () => '/sign-up',
        page: Pages.SignUp,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showSignUpPage,
        getPageComponent: () => SignUp,
    },
    [Pages.Workspace]: {
        route: '/workspace/:id',
        url: (workspace: Workspace) => '/workspace/'+workspace.id,
        page: Pages.Workspace,
        getRouteCallback: (actions: typeof overmind.actions) => actions.workspace.showWorkspacePage,
        getPageComponent: () => WorkspacePage,
    },
    [Pages.WorkspaceCardSet]: {
        route: '/workspace/:id/card-set/:cardSetId',
        url: (workspace: Workspace, cardSet: CardSet) => '/workspace/'+workspace.id+'/card-set/'+cardSet.id,
        page: Pages.Workspace,
        getRouteCallback: (actions: typeof overmind.actions) => actions.workspace.showWorkspacePage,
        getPageComponent: () => WorkspacePage,
    },
    [Pages.WorkspaceCreate]: {
        route: '/workspace-create',
        url: () => '/workspace-create',
        page: Pages.WorkspaceCreate,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showWorkspaceCreatePage,
        getPageComponent: () => WorkspaceCreate,
    }
}

export { pageUrls }