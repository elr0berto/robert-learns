import {derived} from "overmind";

type CreateCardModalState = {
    cardSetId: number | null;
    activeTab: string | null;
    frontHtml: string;
    backHtml: string;
    audioFile: ArrayBuffer | null;
    submitting: boolean;
    readonly audioFileSrc: string | null;
    readonly isOpen: boolean;
}

export const getInitialCreateCardModalState = (): CreateCardModalState => ({
    cardSetId: null,
    activeTab: 'front',
    frontHtml: '',
    backHtml: '',
    audioFile: null,
    submitting: false,
    audioFileSrc: derived((state: CreateCardModalState) => {
        return state.audioFile === null ? null : state.audioFile.;
    }),
    isOpen: derived((state: CreateCardModalState) => {
        return state.cardSetId !== null;
    }),
});

export const state: CreateCardModalState = getInitialCreateCardModalState();