import { Context } from '..';

export const changeEmail = ({ state }: Context, email: string) => {
    state.addUserModal.email = email;
};
