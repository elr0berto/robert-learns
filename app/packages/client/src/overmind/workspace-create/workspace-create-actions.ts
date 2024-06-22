import { Context } from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";
import {getInitialAddUserModalState} from "../add-user-modal/add-user-modal-state";
import {pageUrls, Pages} from "../../page-urls";
import {CreateWorkspaceRequest} from "@elr0berto/robert-learns-shared/dist/api/workspaces";
import {UserRole} from "@elr0berto/robert-learns-shared/dist/api/models";

export const changeFormName = ({ state }: Context, name: string) => {
    state.workspaceCreate.name = name;
};

export const changeFormDescription = ({ state }: Context, desc: string) => {
    state.workspaceCreate.description = desc;
};

export const changeAllowGuests = ({ state }: Context, allowGuests: boolean) => {
    state.workspaceCreate.allowGuests = allowGuests;
};

export const removeUser = ({ state }: Context, userId: number) => {
    state.workspaceCreate.selectedUsers = state.workspaceCreate.selectedUsers.filter(u => u.userId !== userId);
}

export const addUserModalOpen = ({ state }: Context) => {
    state.addUserModal = getInitialAddUserModalState();
    state.workspaceCreate.addUserOpen = true;
}

export const addUserModalClose = ({ state }: Context) => {
    state.workspaceCreate.addUserOpen = false;
}

export const addUser = ({ state, actions }: Context, user: { userId: number, role: UserRole }) => {
    const exists = state.workspaceCreate.selectedUsers.filter(u => u.userId === user.userId).length === 1;
    if (!exists) {
        state.workspaceCreate.selectedUsers.push(user);
    }
    actions.workspaceCreate.addUserModalClose();
}

export const changeUserRole = ({ state }: Context, {user, role}: {user: {userId: number}, role: string}) => {
    switch(role) {
        case UserRole.USER:
        case UserRole.OWNER:
        case UserRole.CONTRIBUTOR:
        case UserRole.ADMINISTRATOR:
            state.workspaceCreate.selectedUsers.filter(u => u.userId === user.userId)[0].role = role as UserRole;
            break;
        default:
            throw new Error('unexpected role: ' + role);
    }
}

export const formSubmit = async ({state, effects, actions} : Context, scope: string) => {
    state.workspaceCreate.submitAttempted = true;

    state.workspaceCreate.submissionError = '';
    if (!state.workspaceCreate.isValid) {
        return;
    }

    state.workspaceCreate.submitting = true;
    const request : CreateWorkspaceRequest = {
        name: state.workspaceCreate.name,
        description: state.workspaceCreate.description,
        allowGuests: state.workspaceCreate.allowGuests,
        workspaceUsers: state.workspaceCreate.selectedUsers,
    };
    if (scope === 'edit') {
        if (state.page.workspaceId === null) {
            throw new Error('workspace id is null');
        }
        request.workspaceId = state.page.workspaceId;
    }
    const resp = await effects.api.workspaces.createWorkspace(request);

    state.workspaceCreate.submitting = false;
    if (resp.status !== ResponseStatus.Success || resp.workspace === null) {
        state.workspaceCreate.submissionError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        return;
    }

    effects.page.router.goTo(pageUrls[Pages.Workspace].url(resp.workspace));
}

export const deleteWorkspace = async ({state} : Context) => {
    if (state.workspaceCreate.deletingWorkspace) {
        return;
    }
    state.workspaceCreate.deleteWorkspaceError = null;
    state.workspaceCreate.deleteWorkspaceModalOpen = true;
}

export const deleteWorkspaceClose = async ({state} : Context) => {
    state.workspaceCreate.deleteWorkspaceModalOpen = false;
}

export const deleteWorkspaceConfirm = async ({state,effects,actions} : Context) => {
    state.workspaceCreate.deletingWorkspace = true;
    state.workspaceCreate.deleteWorkspaceError = null;

    const workspaceId = state.page.workspaceId;

    if (workspaceId === null) {
        throw new Error('workspace id is null');
    }

    const resp = await effects.api.workspaces.deleteWorkspace({workspaceId});

    if (resp.status !== ResponseStatus.Success) {
        state.workspaceCreate.deleteWorkspaceError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        state.workspaceCreate.deletingWorkspace = false;
        return;
    }

    state.notifications.notifications.push({
        message: 'Workspace deleted',
    });

    actions.data.deleteWorkspace(workspaceId);
    effects.page.router.goTo(pageUrls[Pages.Front].url());
}