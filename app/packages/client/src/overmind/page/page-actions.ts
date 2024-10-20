import { Context } from '..';
import {Pages} from "../../page-urls";
import queryString from "query-string";
import {getInitialSignUpState} from "../sign-up/sign-up-state";
import {getInitialSignInState} from "../sign-in/sign-in-state";
import {getInitialWorkspaceCreateState} from "../workspace-create/workspace-create-state";
import {getInitialWorkspaceCardSetCreateState} from "../workspace-card-set-create/workspace-card-set-create-state";
import {getInitialAdminLogsPageState} from "../admin-logs-page/admin-logs-page-state";
import {getInitialWorkspaceCardSetState} from "../workspace-card-set/workspace-card-set-state";
import {getInitialCreateCardModalState} from "../create-card-modal/create-card-modal-state";
import {getInitialEditCardCardSetsModalState} from "../edit-card-card-sets-modal/edit-card-card-sets-modal-state";
import {getInitialAddUserModalState} from "../add-user-modal/add-user-modal-state";
import {getInitialDrillPageState} from "../drill-page/drill-page-state";
import {getInitialDrillRunPageState} from "../drill-run-page/drill-run-page-state";

export type Payload = {
    params: any,
    querystring: queryString.ParsedQuery<string>
}

export const resetModalsAndStuff = ({state, actions}: Context) => {
    state.createCardModal = getInitialCreateCardModalState(null, null);
    state.editCardCardSetsModal = getInitialEditCardCardSetsModalState();
    state.addUserModal = getInitialAddUserModalState();
};

export const load = async ({state, actions}: Context, params?: {payload?: Payload, page?: Pages, onSuccessCallback?: () => void}) => {
    state.page.initializing = true;

    actions.page.resetModalsAndStuff();

    if (params?.page) {
        state.page.page = params.page;
    }

    let promises : Promise<void>[] = [];

    if (params?.page === Pages.Drill) {
        promises.push(actions.page.loadDrillsPage());
        state.page.workspaceId = null;
        state.page.cardSetId = null;
    } else if (params?.page === Pages.DrillRun) {
        promises.push(actions.page.loadDrillRunsPage({drillRunId: parseInt(params?.payload?.params?.drillRunId ?? null)}));
        state.page.workspaceId = null;
        state.page.cardSetId = null;
        state.page.drillRunId = parseInt(params?.payload?.params?.drillRunId ?? null);
    } else {
        promises.push(actions.page.loadWorkspaces({loadCardSets: params?.page === Pages.Front || params?.page === Pages.Workspace || params?.page === Pages.WorkspaceCardSet, loadCards: params?.page === Pages.Workspace || params?.page === Pages.WorkspaceCardSet}));

        if (params?.payload?.params?.workspaceId/* || state.page.workspaceId !== null Removed because otherwise deleting workspace doesnt work.*/) {
            if (params?.payload?.params?.workspaceId) {
                state.page.workspaceId = +params?.payload.params.workspaceId;
            }
            if (typeof state.page.workspaceId !== 'number') {
                throw new Error('workspaceId is ' + typeof state.page.workspaceId);
            }
            //promises.push(actions.page.loadCardSets([state.page.workspaceId]));

            if (params?.payload?.params?.cardSetId/* || state.page.cardSetId !== null: COMMENTED OUT BECAUSE OTHERWISE it gets weird when changing from a cardset-page to the workspace-page. menu thinks cardset is still selected!*/) {
                if (params?.payload?.params?.cardSetId) {
                    state.page.cardSetId = +params?.payload.params.cardSetId;
                }
                if (typeof state.page.cardSetId !== 'number') {
                    throw new Error('cardSetId is ' + typeof state.page.cardSetId);
                }
                //promises.push(actions.page.loadCards([state.page.cardSetId]));
            } else {
                state.page.cardSetId = null;
            }
        } else {
            state.page.workspaceId = null;
            state.page.cardSetId = null;
        }
    }
    state.page.initializing = false;

    await Promise.all(promises);
    if (params?.onSuccessCallback) {
        params.onSuccessCallback();
    }
}

export const loadWorkspaces = async ({state,actions} : Context, {loadCardSets, loadCards}: {loadCardSets: boolean, loadCards: boolean}) => {
    state.page.loadingWorkspaces = true;

    await actions.data.loadWorkspaces();
    if (state.data.workspaces.length > 0) {
        let loadCardSetsPromise : Promise<void> | null = null;
        if (loadCardSets) {
            loadCardSetsPromise = actions.page.loadCardSets(state.data.workspaces.map(w => w.id));
        }
        await actions.data.loadWorkspaceUsers(state.data.workspaces.map(w => w.id));
        if (state.data.workspaceUsers.length > 0) {
            await actions.data.loadUsers(state.data.workspaceUsers.map(wu => wu.userId));
        }
        if (loadCardSetsPromise !== null) {
            await loadCardSetsPromise;

            if (loadCards) {
                await actions.page.loadCards(state.data.cardSets.map(cs => cs.id));
            }
        }
    }

    state.page.loadingWorkspaces = false;
}


export const loadCardSets = async ({state,actions} : Context, workspaceIds: number[]) => {
    state.page.loadingCardSets = true;

    await actions.data.loadCardSets(workspaceIds);
    const cardSetIds = state.data.cardSets.filter(cs => workspaceIds.includes(cs.workspaceId)).map(cs => cs.id);
    if (cardSetIds.length > 0) {
        await actions.data.loadCardSetLinks({cardSetIds});
    }

    state.page.loadingCardSets = false;
}

export const loadCards = async ({state,actions} : Context, cardSetIds: number[]) => {
    state.page.loadingCards = true;

    await actions.data.loadCardSetCards({cardSetIds: cardSetIds});
    let cardIds = state.data.cardSetCards.filter(csc => cardSetIds.includes(csc.cardSetId)).map(csc => csc.cardId);
    if (cardIds.length > 0) {
        // make unique cardIds
        cardIds = Array.from(new Set(cardIds));
        await actions.data.loadCardSetCards({cardIds: cardIds}); // load the rest of the card-set-cards for each card.
        await actions.data.loadCards(cardIds);
    }

    state.page.loadingCards = false;
}

export const loadDrills = async ({state,actions} : Context) => {
    state.page.loadingDrills = true;

    if (!state.signIn.isGuest) {
        await actions.data.loadDrills();
        if (state.data.drills.length > 0) {
            await actions.data.loadDrillCardSets(state.data.drills.map(d => d.id));
        }
    }

    state.page.loadingDrills = false;
}
export const loadDrillsPage = async ({state,actions} : Context) => {
    const drillsPromise = actions.page.loadDrills();
    await actions.page.loadWorkspaces({loadCardSets: true, loadCards: true});
    await drillsPromise;
}

export const loadDrillRunsPage = async ({state,actions} : Context, {drillRunId}: {drillRunId: number | null}) => {
    if (drillRunId === null || isNaN(drillRunId)) {
        throw new Error('drillRunId is null or NaN');
    }
    await actions.page.loadWorkspaces({loadCardSets: true, loadCards: false});

    state.page.loadingDrillRuns = true;
    await actions.data.loadDrillRuns({drillRunIds: [drillRunId]});

    state.page.loadingDrillRuns = false;
}

export const showAdminLogsPage = async ({ actions, state, effects }: Context) => {
    actions.page.load({page: Pages.AdminLogs});
    state.adminLogsPage = getInitialAdminLogsPageState();
    if ((state.signIn.user?.admin ?? false) === true) {
        await actions.adminLogsPage.loadMore();
    }
}

export const showFrontPage = async ({ actions }: Context) => {
    actions.page.load({page: Pages.Front});
}

export const showSignInPage = async ({ state, actions }: Context) => {
    actions.page.load({page: Pages.SignIn});
    state.signIn = getInitialSignInState(state.signIn.userId);
}

export const showSignUpPage = async ({ state, actions }: Context) => {
    actions.page.load({page: Pages.SignUp});
    state.signUp = getInitialSignUpState();
}

export const showWorkspacePage = async ({ actions }: Context, payload: Payload) => {
    actions.page.load({page: Pages.Workspace, payload: payload});
}

export const showWorkspaceCreatePage = async ({ state, actions }: Context) => {
    actions.page.load({page: Pages.WorkspaceCreate});
    state.workspaceCreate = getInitialWorkspaceCreateState(null);
}

export const showWorkspaceEditPage = async ({ state, actions }: Context, payload: Payload) => {
    await actions.page.load({page: Pages.WorkspaceEdit, payload: payload});
    state.workspaceCreate = getInitialWorkspaceCreateState(state.page.workspaceWithWorkspaceUsers);
}

export const showWorkspaceCardSetPage = async ({ state, actions }: Context, payload: Payload) => {
    actions.page.load({page: Pages.WorkspaceCardSet, payload: payload});
    state.workspaceCardSet = getInitialWorkspaceCardSetState();
}

export const showWorkspaceCardSetCreatePage = async ({ state, actions }: Context, payload: Payload) => {
    state.workspaceCardSetCreate.loading = true;
    actions.page.load({page: Pages.WorkspaceCardSetCreate, payload: payload});
    state.workspaceCardSetCreate = getInitialWorkspaceCardSetCreateState(null);
    state.workspaceCardSetCreate.loading = false;
}

export const showWorkspaceCardSetEditPage = async ({ state, effects, actions }: Context, payload: Payload) => {
    state.workspaceCardSetCreate.loading = true;
    await actions.page.load({page: Pages.WorkspaceCardSetEdit, payload: payload});
    state.workspaceCardSetCreate = getInitialWorkspaceCardSetCreateState(state.page.cardSet);
    state.workspaceCardSetCreate.loading = false;
}

export const showDrillPage = async ({ state, actions }: Context) => {
    actions.page.load({page: Pages.Drill});
    state.drillPage = getInitialDrillPageState();
}

export const showDrillRunPage = async ({ state, actions }: Context, payload: Payload) => {
    actions.page.load({page: Pages.DrillRun, payload: payload});
    state.drillRunPage = getInitialDrillRunPageState();
}

export const showPrivacyPolicyPage = async ({ actions }: Context) => {
    actions.page.load({page: Pages.PrivacyPolicy});
}

export const showTermsOfServicePage = async ({ actions }: Context) => {
    actions.page.load({page: Pages.TermsOfService});
}