import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import CancelButton from "./CancelButton";
import questionsData from "../data/questions.json";

const SECS_PER_QUESTION = 30;

function sortAlternately(arr) {
  // Sort the array in ascending order
  // Create a new array to store the alternately sorted elements
  let result = [];

  // Use two pointers, one at the start and one at the end of the sorted array
  let left = 0;
  let right = arr.length - 1;

  // Loop until both pointers meet or cross
  while (left <= right) {
    // Push the element from the start pointer
    result.push(arr[left]);
    // Move the start pointer to the right
    left++;
    // If left has not met or crossed right, push the element from the end pointer
    if (left <= right) {
      result.push(arr[right]);
      // Move the end pointer to the left
      right--;
    }
  }

  // Print or return the alternately sorted array
  return result;
}

const initialState = {
  questions: [],
  // "loading", "error", "ready", "active", "finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 10,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      const { numQuestions, difficulty } = action;
      let filteredQuestions = [...state.questions];

      // Filter questions based on difficulty level
      if (difficulty === 1) {
        filteredQuestions.sort((a, b) => a.points - b.points);
      } else if (difficulty === 3) {
        filteredQuestions.sort((a, b) => b.points - a.points);
      } else {
        filteredQuestions.sort((a, b) => a.points - b.points);
        filteredQuestions = sortAlternately(filteredQuestions);
      }

      // Choose number of questions
      const selectedQuestions = filteredQuestions.slice(0, numQuestions);

      return {
        ...state,
        questions: selectedQuestions,
        status: "active",
        index: 0,
        answer: null,
        points: 0,
        secondsRemaining: numQuestions * SECS_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finishedQuiz":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case "restart":
      return { ...initialState, questions: questionsData, status: "ready" };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  // useEffect(function () {
  //   fetch("http://localhost:8000/questions")
  //     .then((res) => res.json())
  //     .then((data) => dispatch({ type: "dataReceived", payload: data }))
  //     .catch((err) => dispatch({ type: "dataFailed" }));
  // }, []);
  // useEffect(function () {
  //   fetch("http://localhost:8000/questions")
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return res.json();
  //     })
  //     .then((data) => dispatch({ type: "dataReceived", payload: data }))
  //     .catch((err) => {
  //       console.error("Error fetching data:", err);
  //       dispatch({ type: "dataFailed" });
  //     });
  // }, []);

  useEffect(function () {
    dispatch({ type: "dataReceived", payload: questionsData });
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
              <CancelButton dispatch={dispatch} answer={answer} />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
