import {derived} from "overmind";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {config} from "../index";

type CreateCardModalState = {
    cardId: number | null;
    cardSetId: number | null;
    activeTab: string | null;
    frontHtml: string;
    backHtml: string;
    audioFileDataURL: string | null;
    submitting: boolean;
    readonly isOpen: boolean;
    readonly edit: boolean;
    readonly card: Card | null;
}

export const getInitialCreateCardModalState = (): CreateCardModalState => ({
    cardId: null,
    cardSetId: null,
    activeTab: 'front',
    frontHtml: '',
    backHtml: '',
    audioFileDataURL: null,
    submitting: false,
    isOpen: derived((state: CreateCardModalState) => {
        return state.cardSetId !== null;
    }),
    edit: derived((state: CreateCardModalState) => {
        return state.cardId !== null;
    }),
    card: derived((state: CreateCardModalState, rootState: typeof config.state) => {
        if (state.cardId === null) {
            return null;
        }
        const card = rootState.workspaceCardSet.cards.find(card => card.id === state.cardId);
        if (card === undefined || card === null) {
            throw new Error(`Card with id ${state.cardId} not found`);
        }
        return card;
    }),
});

export const state: CreateCardModalState = getInitialCreateCardModalState();