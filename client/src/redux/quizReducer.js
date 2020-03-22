import { send } from "@giantmachines/redux-websocket";

const SET_ACTIVE_QUESTION = "SET_ACTIVE_QUESTION";
export function setActiveQuestion(index) {
  return {
    type: SET_ACTIVE_QUESTION,
    activeQuestion: index
  };
}

export function updateAnswer(groupId, questionId, answer) {
  return function(dispatch) {
    dispatch(send({ update: "update" }, "update"));
    dispatch(updateAnswerInStore(groupId, questionId, answer));
  };
}

const UPDATE_ANSWER_IN_STORE = "UPDATE_ANSWER_IN_STORE";
export function updateAnswerInStore(groupId, questionId, answer) {
  return {
    type: UPDATE_ANSWER_IN_STORE,
    answer: answer,
    questionId: questionId
  };
}

export function quizReducer(
  state = {
    quizId: 0,
    questions: [],
    answers: {}, // { questionId => { text: answer } }
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
      var currentAnswers = state.answers;
      var newAnswers = Object.assign({}, currentAnswers, { [action.questionId]: { text: action.answer } });
      return Object.assign({}, state, { answers: newAnswers });

    case "quiz_started": // From Websocket
      const questions = action.data.questions.slice();

      return Object.assign({}, state, {
        quizId: action.data.id,
        questions: questions
      });

    case "update_answer_from_ws": // From Websocket
      var currentAnswers = state.answers;
      var newAnswers = Object.assign({}, currentAnswers, {
        [action.data.questionId]: { text: action.data.answerText }
      });
      return Object.assign({}, state, { answers: newAnswers });
    default:
      return state;
  }
}
