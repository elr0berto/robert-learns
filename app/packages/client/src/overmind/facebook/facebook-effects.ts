// effects.ts
export const loadFacebookSdk = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!process.env.REACT_APP_FACEBOOK_APP_ID) {
            reject('REACT_APP_FACEBOOK_APP_ID is not set in the environment (.env)');
            return;
        }

        if (window.FB) {
            resolve(); // SDK already loaded
            return;
        }

        window.fbAsyncInit = function() {
            FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID, // Put your appId here
                cookie: true,
                xfbml: true,
                version: 'v21.0',
            });
            resolve();
        };

        // Load Facebook SDK
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.onerror = () => {
            reject('Failed to load Facebook SDK');
        };
        document.body.appendChild(script);
    });
};

export const loginToFacebook = (): Promise<fb.StatusResponse> => {
    return new Promise((resolve, reject) => {
        window.FB.login(
            (response) => {
                resolve(response);
            },
            { scope: 'email,public_profile' }
        );
    });
};
