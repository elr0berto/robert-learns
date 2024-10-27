type VerifyEmailPageState = {
    verifying: boolean;
    errorMessage: string | null;
}

export const getInitialVerifyEmailPageState = () : VerifyEmailPageState => {
    return {
        verifying: false,
        errorMessage: null,
    };
}

export const state: VerifyEmailPageState = getInitialVerifyEmailPageState();