import {derived} from "overmind";
import {EditorState} from "draft-js";

type CreateCardModalState = {
    cardSetId: number | null;
    activeTab: string | null;
    activeTabFront: string | null;
    activeTabBack: string | null;
    frontHtml: string;
    backHtml: string;
    readonly isOpen: boolean;
}

export const getInitialCreateCardModalState = (): CreateCardModalState => ({
    cardSetId: null,
    activeTab: 'front',
    activeTabFront: 'editor',
    activeTabBack: 'editor',
    frontHtml: '',
    backHtml: '',
    isOpen: derived((state: CreateCardModalState) => {
        return state.cardSetId !== null;
    }),
});

export const state: CreateCardModalState = getInitialCreateCardModalState();