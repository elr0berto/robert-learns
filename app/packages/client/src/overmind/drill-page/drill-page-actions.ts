import {Context} from "..";

export const changeDrill = ({ state }: Context, drillId: string) => {
    if (drillId === 'none' || drillId === 'new') {
        state.drillPage.selectedDrillId = drillId;
    } else {
        state.drillPage.selectedDrillId = parseInt(drillId);
    }
}

export const changeDrillName = ({ state }: Context, name: string) => {
    state.drillPage.drillName = name;
}

export const changeDrillDescription = ({ state }: Context, description: string) => {
    state.drillPage.drillDescription = description;
}

export const toggleWorkspaceId = ({ state }: Context, workspaceId: number) => {
    const index = state.drillPage.selectedWorkspaceIds.indexOf(workspaceId);
    if (index === -1) {
        state.drillPage.selectedWorkspaceIds.push(workspaceId);
    } else {
        state.drillPage.selectedWorkspaceIds.splice(index, 1);
    }
}

export const toggleCardSetId = ({ state }: Context, cardSetId: number) => {
    const index = state.drillPage.selectedCardSetIds.indexOf(cardSetId);
    if (index === -1) {
        state.drillPage.selectedCardSetIds.push(cardSetId);
    } else {
        state.drillPage.selectedCardSetIds.splice(index, 1);
    }
}