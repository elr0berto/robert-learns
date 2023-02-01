import { Context } from '..';
import {PermissionUser} from "@elr0berto/robert-learns-shared/dist/types";
import {ResponseStatus} from "@elr0berto/robert-learns-shared/dist/api/models";

export const changeEmail = ({ state }: Context, email: string) => {
    state.addUserModal.email = email;
};

export const submit = async ({ state, effects }: Context, onAdd: (user: PermissionUser) => void) => {
    state.addUserModal.submitting = true;
    const response = await effects.api.users.userGetByEmail({email: state.addUserModal.email});
    if (response.status === ResponseStatus.UserError) {
        blah blah
    }
};