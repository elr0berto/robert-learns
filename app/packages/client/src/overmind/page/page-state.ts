import {Pages} from "../../page-urls";

type PageState = {
    current: Pages | null;
}

export const state: PageState = {
    current: null,
};