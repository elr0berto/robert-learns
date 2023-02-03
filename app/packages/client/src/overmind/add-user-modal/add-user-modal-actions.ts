import { Context } from '..';
import {PermissionUser, UserRole} from "@elr0berto/robert-learns-shared/dist/types";
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";

export const changeEmail = ({ state }: Context, email: string) => {
    state.addUserModal.email = email;
};

export const submit = async ({ state, effects }: Context, onAdd: (user: PermissionUser) => void) => {
    state.addUserModal.errorMessage = null;
    state.addUserModal.submitting = true;
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
    onAdd({
        userId: response.user.id,
        name: response.user.name(),
        email: response.user.email,
        role: UserRole.USER,
    });
};