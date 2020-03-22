import React from "react";
import { useDispatch, useSelector } from "react-redux";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import TextQuestion from "./textQuestion";
import { setActiveQuestion } from "../redux/quizReducer";
import SwipeableViews from "react-swipeable-views";


function Quiz() {
  const activeStep = useSelector(state => state.quiz.activeQuestion);
  const totalNumberOfSteps = useSelector(state => state.quiz.questions.length);
  const questions = useSelector(state => state.quiz.questions);

  const dispatch = useDispatch();

  const handleNext = () => {
    dispatch(setActiveQuestion(activeStep + 1));
  };

  const handleBack = () => {
    dispatch(setActiveQuestion(activeStep - 1));
  };

  const handleStepChange = step => {
    dispatch(setActiveQuestion(step));
  };

  const handleTip = () => {
    window.open("https://www.sandbox.paypal.com/us/signin", "Paypal");
  }

  return (
    <React.Fragment>
      <SwipeableViews axis="x" index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
        {questions.map(question => (
          <TextQuestion question={question}></TextQuestion>
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
      <Button 
        variant="contained" onClick={handleTip}>
          Trinkgeld
        </Button>
    </React.Fragment>
  );
}



export default Quiz;
