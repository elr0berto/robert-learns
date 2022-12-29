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

function readFileAsDataURLAsync(file: File) : Promise<string | null> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(typeof reader.result !== 'string' ? null : reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    })
}

export const setAudioFile = async ({ state, effects }: Context, file: FileList|null) => {
    if (file === null || file.length === 0) {
        state.createCardModal.audioFile = null;
        state.createCardModal.audioFileDataURL = null;
    } else {
        state.createCardModal.audioFile = file;
        state.createCardModal.audioFileDataURL = await readFileAsDataURLAsync(file[0]);
    }
}

export const submit = async ({ state, effects }: Context) => {
    state.createCardModal.submitting = true;
    console.log('state.createCardModal.audioFile', state.createCardModal.audioFile);
    console.log('state.createCardModal.audioFile instanceof File', state.createCardModal.audioFile instanceof File);
    console.log('state.createCardModal.audioFile instanceof Array', state.createCardModal.audioFile instanceof Array);
    const resp = await effects.api.cards.cardCreate({
        cardSetId: state.createCardModal.cardSetId!,
        front: state.createCardModal.frontHtml,
        back: state.createCardModal.backHtml,
        audio: state.createCardModal.audioFile === null ? null : state.createCardModal.audioFile[0]
    });

}