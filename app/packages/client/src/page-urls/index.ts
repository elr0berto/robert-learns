import {overmind} from "..";
import SignUp from "../components/sign-up/SignUp";
import SignIn from "../components/sign-in/SignIn";
import WorkspaceCreate from "../components/workspace/WorkspaceCreate";
import WorkspacePage from "../components/workspace/WorkspacePage";
import WorkspaceCardSetCreatePage from "../components/workspace/WorkspaceCardSetCreatePage";
import WorkspaceCardSetPage from "../components/workspace/WorkspaceCardSetPage";
import {Workspace} from "@elr0berto/robert-learns-shared/dist/api/models";
import AdminLogsPage from "../components/admin/AdminLogsPage";

export enum Pages {
    AdminLogs = "adminLogs",
    Front = "front",
    SignIn = "signIn",
    SignUp = "signUp",
    Workspace = "workspace",
    WorkspaceCardSetCreate = "workspaceCardSetCreate",
    WorkspaceCardSetEdit = "workspaceCardSetEdit",
    WorkspaceCardSet = "workspaceCardSet",
    WorkspaceCreate = "workspaceCreate",
    WorkspaceEdit = "workspaceEdit",
}

const pageUrls = {
    [Pages.AdminLogs]: {
        route: '/admin/logs',
        url: () => '/admin/logs',
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showAdminLogsPage,
        getPageComponent: () => AdminLogsPage,
    },
    [Pages.Front]: {
        route: '/',
        url: () => '/',
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showFrontPage,
        getPageComponent: () => null,
    },
    [Pages.SignIn]: {
        route: '/sign-in',
        url: () => '/sign-in',
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showSignInPage,
        getPageComponent: () => SignIn,
    },
    [Pages.SignUp]: {
        route: '/sign-up',
        url: () => '/sign-up',
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showSignUpPage,
        getPageComponent: () => SignUp,
    },
    [Pages.Workspace]: {
        route: '/workspace/:workspaceId',
        url: (workspace: Workspace) => '/workspace/'+workspace.id,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showWorkspacePage,
        getPageComponent: () => WorkspacePage,
    },
    [Pages.WorkspaceCardSetCreate]: {
        route: '/workspace/:workspaceId/card-set-create',
        url: (workspace: Workspace) => '/workspace/'+workspace.id+'/card-set-create/',
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showWorkspaceCardSetCreatePage,
        getPageComponent: () => WorkspaceCardSetCreatePage,
    },
    [Pages.WorkspaceCardSetEdit]: {
        route: '/workspace/:workspaceId/card-set-edit/:cardSetId',
        url: (workspace: Workspace, cardSet: {id: number}) => '/workspace/'+workspace.id+'/card-set-edit/'+cardSet.id,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showWorkspaceCardSetEditPage,
        getPageComponent: () => WorkspaceCardSetCreatePage,
    },
    [Pages.WorkspaceCardSet]: {
        route: '/workspace/:workspaceId/card-set/:cardSetId',
        url: (workspace: Workspace, cardSet: {id: number, name: string}) => '/workspace/'+workspace.id+'/card-set/'+cardSet.id,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showWorkspaceCardSetPage,
        getPageComponent: () => WorkspaceCardSetPage,
    },
    [Pages.WorkspaceCreate]: {
        route: '/workspace-create',
        url: () => '/workspace-create',
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showWorkspaceCreatePage,
        getPageComponent: () => WorkspaceCreate,
    },
    [Pages.WorkspaceEdit]: {
        route: '/workspace-edit/:workspaceId',
        url: (workspace: Workspace) => '/workspace-edit/'+workspace.id,
        getRouteCallback: (actions: typeof overmind.actions) => actions.page.showWorkspaceEditPage,
        getPageComponent: () => WorkspaceCreate,
    }
}

export { pageUrls }