import { Context } from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";
import {PermissionUser, UserRole} from "@elr0berto/robert-learns-shared/dist/types";
import {getInitialAddUserModalState} from "../add-user-modal/add-user-modal-state";
import {pageUrls, Pages} from "../../page-urls";

export const changeFormName = ({ state }: Context, name: string) => {
    state.workspaceEdit.form.name = name;
};

export const changeFormDescription = ({ state }: Context, desc: string) => {
    state.workspaceEdit.form.description = desc;
};

export const changeAllowGuests = ({ state }: Context, allowGuests: boolean) => {
    state.workspaceEdit.form.allowGuests = allowGuests;
};

export const removeUser = ({ state }: Context, userId: number) => {
    state.workspaceEdit.form.selectedUsers = state.workspaceEdit.form.selectedUsers.filter(u => u.userId !== userId);
}

export const addUserModalOpen = ({ state }: Context) => {
    state.addUserModal = getInitialAddUserModalState();
    state.workspaceEdit.form.addUserOpen = true;
}

export const addUserModalClose = ({ state }: Context) => {
    state.workspaceEdit.form.addUserOpen = false;
}

export const addUser = ({ state, actions }: Context, user: PermissionUser) => {
    const exists = state.workspaceEdit.form.selectedUsers.filter(u => u.userId === user.userId).length === 1;
    if (!exists) {
        state.workspaceEdit.form.selectedUsers.push(user);
    }
    actions.workspaceEdit.addUserModalClose();
}

export const changeUserRole = ({ state }: Context, {user, role}: {user: {userId: number}, role: string}) => {
    switch(role) {
        case UserRole.USER:
        case UserRole.OWNER:
        case UserRole.CONTRIBUTOR:
        case UserRole.ADMINISTRATOR:
            state.workspaceEdit.form.selectedUsers.filter(u => u.userId === user.userId)[0].role = role;
            break;
        default:
            throw new Error('unexpected role: ' + role);
    }

}

export const formSubmit = async ({state, effects, actions} : Context) => {
    state.workspaceEdit.form.submitAttempted = true;

    state.workspaceEdit.form.submissionError = '';
    if (!state.workspaceCreate.form.isValid) {
        return;
    }

    state.workspaceEdit.form.submitting = true;
    const resp = await effects.api.workspaces.workspaceEdit({
        name: state.workspaceCreate.form.name,
        description: state.workspaceCreate.form.description,
        allowGuests: state.workspaceCreate.form.allowGuests,
        workspaceUsers: state.workspaceCreate.form.selectedUsers,
    });

    state.workspaceEdit.form.submitting = false;
    if (resp.status !== ResponseStatus.Success || resp.workspace === null) {
        state.workspaceEdit.form.submissionError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        return;
    }

    actions.workspaces.getWorkspaceList();

    //effects.page.router.goTo('/');
    effects.page.router.goTo(pageUrls[Pages.Workspace].url(resp.workspace));
}