import {Context} from "..";
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

export const setActiveTabFront = ({state}: Context, activeTab: string | null) => {
    state.createCardModal.activeTabFront = activeTab;
}

export const setActiveTabBack = ({state}: Context, activeTab: string | null) => {
    state.createCardModal.activeTabBack = activeTab;
}

export const setFrontHtml = ({ state }: Context, html: string) => {
    state.createCardModal.frontHtml = html;
}

export const setBackHtml = ({ state }: Context, html: string) => {
    state.createCardModal.backHtml = html;
}

export const uploadFile = async ({ state, effects }: Context, file: File) => {
    const resp = await effects.api.cardSets.cardSetUploadFile(state.createCardModal.cardSetId!, file);
    return resp.url;
}