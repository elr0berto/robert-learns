import {derived} from "overmind";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {config} from "../index";

type DrillPageState = {
    selectedDrillId: number | 'none' | 'new';
    drillName: string;
    drillDescription: string;
    selectedWorkspaceIds: number[];
    selectedCardSetIds: number[];
}

export const getInitialDrillPageState = () : DrillPageState => {
    return {
        selectedDrillId: 'none',
        drillName: '',
        drillDescription: '',
        selectedWorkspaceIds: [],
        selectedCardSetIds: [],
    };
}

export const state: DrillPageState = getInitialDrillPageState();