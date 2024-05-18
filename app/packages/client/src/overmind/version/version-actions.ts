import { Context } from '..';

export const getVersion = async ({state,effects} : Context) => {
    const version = await effects.api.version.getVersion();
    state.version.version = version.version;
}