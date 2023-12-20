import {derived} from "overmind";
import {Card} from "@elr0berto/robert-learns-shared/dist/api/models";
import {config} from "../index";

type DrillRunPageState = {

}

export const getInitialDrillRunPageState = () : DrillRunPageState => {
    return {

    };
}

export const state: DrillRunPageState = getInitialDrillRunPageState();