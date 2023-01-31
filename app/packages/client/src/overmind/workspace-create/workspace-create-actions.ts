import { Context } from '..';
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";
import {PermissionUser, UserRole} from "@elr0berto/robert-learns-shared/dist/types";

export const changeFormName = ({ state }: Context, name: string) => {
    state.workspaceCreate.form.name = name;
};

export const changeFormDescription = ({ state }: Context, desc: string) => {
    state.workspaceCreate.form.description = desc;
};

export const changeAllowGuests = ({ state }: Context, allowGuests: boolean) => {
    state.workspaceCreate.form.allowGuests = allowGuests;
};

export const removeUser = ({ state }: Context, userId: number) => {
    state.workspaceCreate.form.selectedUsers = state.workspaceCreate.form.selectedUsers.filter(u => u.userId !== userId);
}

export const addUserModalOpen = ({ state }: Context) => {
    state.workspaceCreate.form.addUserOpen = true;
}

export const addUserModalClose = ({ state }: Context) => {
    state.workspaceCreate.form.addUserOpen = false;
}

export const addUser = ({ state }: Context, user: PermissionUser) => {
    const exists = state.workspaceCreate.form.selectedUsers.filter(u => u.userId === user.userId).length === 1;
    if (!exists) {
        state.workspaceCreate.form.selectedUsers.push(user);
    }
}

export const changeUserRole = ({ state }: Context, {user, role}: {user: {userId: number}, role: string}) => {
    switch(role) {
        case UserRole.USER:
        case UserRole.OWNER:
        case UserRole.CONTRIBUTOR:
        case UserRole.ADMINISTRATOR:
            state.workspaceCreate.form.selectedUsers.filter(u => u.userId === user.userId)[0].role = role;
            break;
        default:
            throw new Error('unexpected role: ' + role);
    }

}

export const formSubmit = async ({state, effects, actions} : Context) => {
    state.workspaceCreate.form.submitAttempted = true;

    state.workspaceCreate.form.submissionError = '';
    if (!state.workspaceCreate.form.isValid) {
        return;
    }

    state.workspaceCreate.form.submitting = true;
    const resp = await effects.api.workspaces.workspaceCreate({
        name: state.workspaceCreate.form.name,
        description: state.workspaceCreate.form.description,
        allowGuests: state.workspaceCreate.form.allowGuests,
        workspaceUsers: state.workspaceCreate.form.selectedUsers,
    });

    state.workspaceCreate.form.submitting = false;
    if (resp.status !== ResponseStatus.Success) {
        state.workspaceCreate.form.submissionError = resp.errorMessage ?? "Unexpected error. please refresh the page and try again later.";
        return;
    }

    actions.workspaces.getWorkspaceList();

    effects.page.router.goTo('/');
}