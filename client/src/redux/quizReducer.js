import { send } from "@giantmachines/redux-websocket";

const SET_ACTIVE_QUESTION = "SET_ACTIVE_QUESTION";
export function setActiveQuestion(index) {
  return {
    type: SET_ACTIVE_QUESTION,
    activeQuestion: index
  };
}

export function updateAnswer(positionInRound, answer) {
  return function(dispatch) {
    dispatch(send({ update: "update" }, "update"));
    dispatch(updateAnswerInStore(positionInRound, answer));
  };
}

const UPDATE_ANSWER_IN_STORE = "UPDATE_ANSWER_IN_STORE";
export function updateAnswerInStore(positionInRound, answer) {
  return {
    type: UPDATE_ANSWER_IN_STORE,
    answer: answer,
    positionInRound: positionInRound
  };
}

export function quizReducer(
  state = {
    questions: [
      { positionInRound: 1, question: "Was ist das?", answer: "" },
      { positionInRound: 2, question: "Wo ist das?", answer: "" },
      { positionInRound: 3, question: "Wer ist das?", answer: "" }
    ],
    activeQuestion: 0
  },
  action
) {
  switch (action.type) {
    case SET_ACTIVE_QUESTION:
      return Object.assign({}, state, {
        activeQuestion: action.activeQuestion
      });
    case UPDATE_ANSWER_IN_STORE:
      const updatedQuestions = [];
      for (const idx in state.questions) {
        const question = state.questions[idx];

        if (question.positionInRound == action.positionInRound) {
          const modifiedQuestion = Object.assign({}, question, {
            answer: action.answer
          });
          updatedQuestions.push(modifiedQuestion);
        } else {
          updatedQuestions.push(question);
        }
      }
      return Object.assign({}, state, { questions: updatedQuestions });
    default:
      return state;
  }
}
