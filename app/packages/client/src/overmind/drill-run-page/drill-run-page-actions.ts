import {Context} from "..";
import {Pages, pageUrls} from "../../page-urls";
import {CreateDrillRunRequest} from "@elr0berto/robert-learns-shared/dist/api/drill-runs";

export const flip = ({ state, effects, actions }: Context) => {
    state.drillRunPage.side = state.drillRunPage.side === 'front' ? 'back' : 'front';
}

export const answer = async ({ state, effects, actions }: Context, correct: boolean) => {
    if (state.drillRunPage.currentQuestion === null) {
        throw new Error('No current question');
    }

    const drillRunQuestionId = state.drillRunPage.currentQuestion.id;
    state.drillRunPage.switchingCards = true;
    state.drillRunPage.side = 'front';
    actions.data.answerDrillRunQuestion({drillRunQuestionId, correct});
    effects.api.drillRuns.answerDrillRunQuestion({drillRunQuestionId,correct});
    await new Promise(r => setTimeout(r, 500));
    state.drillRunPage.switchingCards = false;
}

export const runAgain = async ({ state, effects, actions }: Context, {wrongOnly, reset}: {wrongOnly?: boolean, reset?: true}) => {
    if (state.drillRunPage.drill === null) {
        throw new Error('No drill');
    }
    let request : CreateDrillRunRequest = {
        drillId: state.drillRunPage.drill.id,
    };

    if (typeof wrongOnly !== 'undefined') {
        request.wrongOnly = wrongOnly;
    }

    if (!reset) {
        request.drillRunId = state.drillRunPage.drillRun?.id;
    }

    const resp = await effects.api.drillRuns.createDrillRun(request);

    if (resp.drillRun === null) {
        throw new Error('DrillRun missing from response.');
    }
    actions.data.addOrUpdateDrillRuns([resp.drillRun]);
    effects.page.router.goTo(pageUrls[Pages.DrillRun].url(state.drillRunPage.drill, resp.drillRun));
}

