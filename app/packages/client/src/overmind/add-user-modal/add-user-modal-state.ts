type AddUserModalState = {
    email: string,
    submitting: boolean,
    errorMessage: string | null,
}

export const getInitialAddUserModalState = (): AddUserModalState => ({
    email: '',
    submitting: false,
    errorMessage: null,
});

export const state: AddUserModalState = getInitialAddUserModalState();