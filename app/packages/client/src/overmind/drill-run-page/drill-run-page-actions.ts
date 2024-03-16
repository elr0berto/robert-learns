import {Context} from "..";

export const flip = ({ state, effects, actions }: Context) => {
    state.drillRunPage.side = state.drillRunPage.side === 'front' ? 'back' : 'front';
}

export const answer = ({ state, effects, actions }: Context, correct: boolean) => {
    if (state.drillRunPage.currentQuestion === null) {
        throw new Error('No current question');
    }

    actions.data.answerDrillRunQuestion(state.drillRunPage.currentQuestion.id, correct);
    effects.api.drillRuns.answerDrillRunQuestion({

    });
}