
type VersionState = {
    version: string | null;
    versionShared: string | null;
}

export const getInitialVersionState = () : VersionState => ({
    version: null,
    versionShared: null,
});

export const state: VersionState = getInitialVersionState();