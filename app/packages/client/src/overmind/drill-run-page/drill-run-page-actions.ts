import {Context} from "..";

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