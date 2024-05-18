
type VersionState = {
    version: string | null;
}

export const getInitialVersionState = () : VersionState => ({
    version: null,
});

export const state: VersionState = getInitialVersionState();