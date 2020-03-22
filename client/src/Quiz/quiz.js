import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import TextQuestion from "./textQuestion";
import { setActiveQuestion } from "../redux/quizReducer";
import SwipeableViews from "react-swipeable-views";
import { updateAnswer } from "../redux/quizReducer";

function Quiz(props) {
  const activeStep = useSelector(state => state.quiz.activeQuestion);
  const totalNumberOfSteps = useSelector(state => state.quiz.questions.length);
  const questions = useSelector(state => state.quiz.questions);

  const dispatch = useDispatch();
  const socket = props.socket;

  const handleNext = () => {
    dispatch(setActiveQuestion(activeStep + 1));
  };

  const handleBack = () => {
    dispatch(setActiveQuestion(activeStep - 1));
  };

  const handleStepChange = step => {
    dispatch(setActiveQuestion(step));
  };

  const typeText = (positionInRound, e) => {
    const answerText = e.target.value;
    dispatch(updateAnswer(positionInRound, answerText));
    socket.emit("write_answer", { answerText });
  };

  return (
    <React.Fragment>
      <SwipeableViews axis="x" index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
        {questions.map(question => (
          <TextQuestion question={question} typeTextHandler={typeText}></TextQuestion>
        ))}
      </SwipeableViews>
      <MobileStepper
        variant="dots"
        steps={totalNumberOfSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === totalNumberOfSteps - 1}>
            Vor <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Zurück
          </Button>
        }
      />
    </React.Fragment>
  );
}

export default Quiz;
