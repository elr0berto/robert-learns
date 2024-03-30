import {Context} from "..";
import {Pages, pageUrls} from "../../page-urls";

export const flip = ({ state, effects, actions }: Context) => {
    state.drillRunPage.side = state.drillRunPage.side === 'front' ? 'back' : 'front';
}

export const answer = async ({ state, effects, actions }: Context, correct: boolean) => {
    if (state.drillRunPage.currentQuestion === null) {
        throw new Error('No current question');
    }

    const drillRunQuestionId = state.drillRunPage.currentQuestion.id;
    actions.data.answerDrillRunQuestion({drillRunQuestionId, correct});
    await effects.api.drillRuns.answerDrillRunQuestion({drillRunQuestionId,correct});
}

export const runAgain = async ({ state, effects, actions }: Context, {wrongOnly}: {wrongOnly: boolean}) => {
    if (state.drillRunPage.drill === null) {
        throw new Error('No drill');
    }
    const resp = await effects.api.drillRuns.createDrillRun({drillId: state.drillRunPage.drill.id});
    if (resp.drillRun === null) {
        throw new Error('DrillRun missing from response.');
    }
    actions.data.addOrUpdateDrillRuns([resp.drillRun]);
    effects.page.router.goTo(pageUrls[Pages.DrillRun].url(state.drillRunPage.drill, resp.drillRun));
}

export const runAgainWrongOnly = async ({ state, effects, actions }: Context) => {

}