import {Context} from "../index";
import {getInitialCreateCardModalState} from "./create-card-modal-state";

export const openCreateCardModal = ({ state }: Context, cardSetId: number) => {
    state.createCardModal = getInitialCreateCardModalState();
    state.createCardModal.cardSetId = cardSetId;
}

export const closeCreateCardModal = ({ state }: Context) => {
    state.createCardModal.cardSetId = null;
}

export const setActiveTab = ({state}: Context, activeTab: string | null) => {
    state.createCardModal.activeTab = activeTab;
}

export const setFrontHtml = ({ state }: Context, html: string) => {
    state.createCardModal.frontHtml = html;
    console.log('html', html);
}

export const uploadFile = async ({ state, effects }: Context, file: File) => {
    const resp = await effects.api.cardSets.cardSetUploadFile(state.createCardModal.cardSetId!, file);
    return resp.url;
}