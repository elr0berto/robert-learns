type FacebookState = {
    loading: boolean,
}

export const getInitialFacebookState = (): FacebookState => ({
    loading: false,
});

export const state: FacebookState = getInitialFacebookState();