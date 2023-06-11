import { Context } from '..';
import {ResponseStatus, UserRole} from "@elr0berto/robert-learns-shared/dist/api/models";
import {Pages} from "../../page-urls";

export const changeEmail = ({ state }: Context, email: string) => {
    state.addUserModal.email = email;
    state.addUserModal.errorMessage = null;
};

export const submit = async ({ state, effects, actions }: Context, onAdd: (user: { userId: number, role: UserRole }) => void) => {
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

    actions.data.addOrUpdateUser(response.user);

    onAdd({
        userId: response.user.id,
        role: UserRole.USER,
    });
};