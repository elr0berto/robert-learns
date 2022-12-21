import {derived} from "overmind";

type CreateCardModalState = {
    cardSetId: number | null;
    activeTab: string | null;
    frontHtml: string;
    backHtml: string;
    audioFile: string | null;
    readonly isOpen: boolean;
}

export const getInitialCreateCardModalState = (): CreateCardModalState => ({
    cardSetId: null,
    activeTab: 'front',
    frontHtml: '',
    backHtml: '',
    audioFile: null,
    isOpen: derived((state: CreateCardModalState) => {
        return state.cardSetId !== null;
    }),
});

export const state: CreateCardModalState = getInitialCreateCardModalState();