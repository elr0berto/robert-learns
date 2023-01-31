import {derived} from "overmind";
import {config} from "..";
import {UserData} from "@elr0berto/robert-learns-shared/dist/api/models";

type AddUserModalState = {
    email: string,
    submitting: boolean,
}

export const getInitialAddUserModalState = (): AddUserModalState => ({
    email: '',
    submitting: false,
});

export const state: AddUserModalState = getInitialAddUserModalState();