import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-ui/core";
import { useParams } from "react-router-dom";

const HostQuiz = props => {
  const { socket } = props;
  const [error, setError] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [round, setRound] = useState(null);
  const [lastRound, setLastRound] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    fetch("/api/quiz/" + id)
      .then(res => res.json())
      .then(
        result => {
          setQuiz(result);
          setIsLoaded(true);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [id]);

  useEffect(() => {
    fetch("/api/questions/" + id)
      .then(res => res.json())
      .then(
        result => {
          setQuestions(result);
          setQuestionsLoaded(true);
          setLastRound(Math.max(...result.map(question => question.round)));
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [id]);

  const questionItems = questions.map(question => (
    <Typography key={question.id}>
      Frage: {question.question}| Antwort:{question.correctAnswer} | Runde: {question.round}
    </Typography>
  ));

  const startQuiz = () => {
    console.log("starting quiz", quiz.id);
    socket.emit("start_quiz", quiz.id);
    setRound(1);
  };

  const finishRound = () => {
    console.log("Bewertung abgeschlossen", round);
    setRound(round + 1);
  };

  const startRound = () => {
    console.log("Runde gestartet", quiz.id, round);
    socket.emit("round_started", quiz.id, round);
  };

  const timesUp = () => {
    console.log("Rundenzeit abgelaufen", quiz.id, round);
    socket.emit("round_finished", quiz.id, round);
  };

  if (!isLoaded || !questionsLoaded) {
    return <Typography>Lade...</Typography>;
  } else if (error) {
    return <Typography>Error while loading quiz: {error}</Typography>;
  } else if (null === quiz) {
    return <Typography>Quiz not found</Typography>;
  } else if (!round) {
    return (
      <div>
        <Typography variant="h4">
          Quiz {quiz.date}({lastRound} Runden)
        </Typography>
        {questionItems}
        <Button variant="contained" color="primary" onClick={startQuiz}>
          Start!
        </Button>
      </div>
    );
  } else if (round <= lastRound) {
    return (
      <HostQuizRound round={round} roundTime={5} finishRound={finishRound} timesUp={timesUp} startRound={startRound} />
    );
  } else {
    return <div>Fertig: Ergebnisse</div>;
  }
};

const HostQuizRound = props => {
  const { round, roundTime, finishRound, timesUp, startRound } = props;
  const [counter, setCounter] = useState(roundTime);
  const [roundStarted, setRoundStarted] = useState(false);

  const resetState = () => {
    setCounter(roundTime);
    setRoundStarted(false);
  };

  useEffect(() => {
    resetState();
  }, [round]);

  useEffect(() => {
    if (roundStarted) {
      if (counter > 0) {
        setTimeout(() => setCounter(counter - 1), 1000);
      } else {
        timesUp();
      }
    }
  }, [counter, roundStarted]);

  const startTimer = () => {
    setRoundStarted(true);
    setCounter(roundTime);
    startRound();
  };

  if (counter == 0) {
    return (
      <div>
        <Typography variant="h4">Runde {round}: Antworten der Teams</Typography>
        <Button variant="contained" color="primary" onClick={finishRound}>
          Bewertung abschließen
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <Typography variant="h4">Runde {round}</Typography>
        <div>Zeit übrig: {counter}</div>
        <Button variant="contained" color="primary" onClick={startTimer} disabled={roundStarted}>
          Runde starten
        </Button>
      </div>
    );
  }
};

export default HostQuiz;
export { HostQuizRound };
