import {derived} from "overmind";
import {EditorState} from "draft-js";

type CreateCardModalState = {
    cardSetId: number | null;
    activeTab: string | null;
    frontHtml: string;
    readonly isOpen: boolean;
}

export const getInitialCreateCardModalState = (): CreateCardModalState => ({
    cardSetId: null,
    activeTab: 'front',
    frontHtml: '',
    isOpen: derived((state: CreateCardModalState) => {
        return state.cardSetId !== null;
    }),
});

export const state: CreateCardModalState = getInitialCreateCardModalState();