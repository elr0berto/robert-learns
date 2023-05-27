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
    submitError: string | null;
    readonly isOpen: boolean;
    readonly edit: boolean;
    readonly card: Card | null;
}



export const getInitialCreateCardModalState = (cardSetId: number | null, card: Card | null) : CreateCardModalState => {
    return {
        cardId: card?.id ?? null,
        cardSetId: cardSetId,
        activeTab: 'front',
        frontHtml: card?.front.content ?? '',
        backHtml: card?.back.content ?? '',
        audioFileDataURL: card?.audio?.getUrl() ?? null,
        submitting: false,
        submitError: null,
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
    };
}

export const state: CreateCardModalState = getInitialCreateCardModalState(null, null);