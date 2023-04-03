import { Context } from '..';
import {PermissionUser, UserRole} from "@elr0berto/robert-learns-shared/dist/types";
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Pages} from "../../page-urls";

export const changeEmail = ({ state }: Context, email: string) => {
    state.addUserModal.email = email;
    state.addUserModal.errorMessage = null;
};

export const submit = async ({ state, effects }: Context, onAdd: (user: PermissionUser) => void) => {
    const scope = state.page.current === Pages.WorkspaceCreate ? 'create' : 'edit';

    state.addUserModal.errorMessage = null;
    state.addUserModal.submitting = true;
    if (state.addUserModal.email === state.signIn.user!.email) {
        state.addUserModal.submitting = false;
        state.addUserModal.errorMessage = 'You cannot add your self.';
        return;
    }
    const response = await effects.api.users.userGetByEmail({email: state.addUserModal.email});
    state.addUserModal.submitting = false;
    if (response.status === ResponseStatus.UserError) {
        state.addUserModal.errorMessage = response.errorMessage;
        return;
    }
    if (response.user === null) {
        state.addUserModal.errorMessage = 'Could not find user with this email! Maybe they did not register with this email yet.';
        return;
    }

    let availableRoles = Object.values(UserRole);

    if (scope === 'edit') {
        switch (state.workspace.workspace!.myRole) {
            case UserRole.OWNER:
                break;
            case UserRole.ADMINISTRATOR:
                availableRoles = availableRoles.filter(role => role !== UserRole.OWNER);
                break;
            default:
                throw new Error('myRole has to be owner or admin to add users');
        }
    }

    onAdd({
        userId: response.user.id,
        name: response.user.name(),
        email: response.user.email,
        isGuest: response.user.isGuest,
        role: UserRole.USER,
        canRoleBeChanged: true,
        canBeRemoved: true,
        availableRoles: availableRoles,
    });
};