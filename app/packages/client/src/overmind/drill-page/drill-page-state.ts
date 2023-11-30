import {derived} from "overmind";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {config} from "../index";

type DrillPageState = {

}

export const getInitialDrillPageState = () : DrillPageState => {
    return {

    };
}

export const state: DrillPageState = getInitialDrillPageState();