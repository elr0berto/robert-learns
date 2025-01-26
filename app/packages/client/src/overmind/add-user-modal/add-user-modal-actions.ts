import { Context } from '..';
import {ResponseStatus, UserRole} from "@elr0berto/robert-learns-shared/dist/api/models";
import {validateUserGetByEmailRequest} from "@elr0berto/robert-learns-shared/dist/api/users";

export const changeEmail = ({ state }: Context, email: string) => {
    state.addUserModal.email = email;
    state.addUserModal.errorMessage = null;
};

export const submit = async ({ state, effects, actions }: Context) => {
    state.addUserModal.errorMessage = null;
    state.addUserModal.submitting = true;
    if (state.signIn.user === null) {
        throw new Error('User is not signed in!');
    }
    if (state.page.workspaceId === null) {
        throw new Error('No workspace id provided!');
    }
    if (state.addUserModal.email === state.signIn.user.email) {
        state.addUserModal.submitting = false;
        state.addUserModal.errorMessage = 'You cannot add your self.';
        return;
    }
    const request = {email: state.addUserModal.email};
    const validationErrors = validateUserGetByEmailRequest(request);
    if (validationErrors.length > 0) {
        state.addUserModal.submitting = false;
        state.addUserModal.errorMessage = validationErrors.join(' ');
        return;
    }
    const response = await effects.api.users.userGetByEmail(request);
    state.addUserModal.submitting = false;
    if (response.status === ResponseStatus.UserError) {
        state.addUserModal.errorMessage = response.errorMessage;
        return;
    }

    if (response.user === null) {
        const resp = await effects.api.workspaceUserInvites.addWorkspaceUserInvite({
            workspaceId: state.page.workspaceId,
            email: state.addUserModal.email,
        });
    } else {
        const resp = await effects.api.workspaceUsers.addWorkspaceUser({
            workspaceId: state.page.workspaceId,
            userId: response.user.id,
        });
        actions.data.addOrUpdateUser(response.user);
        actions.workspaceCreate.addUser(user);
    }

    actions.data.addOrUpdateUser(response.user);

    onAdd({
        userId: response.user.id,
        role: UserRole.USER,
    });
};