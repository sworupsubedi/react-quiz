import React, { useState } from "react";

function StartScreen({ numQuestions, dispatch }) {
  const [selectedNumQuestions, setSelectedNumQuestions] =
    useState(numQuestions);
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);

  const handleStartQuiz = () => {
    dispatch({
      type: "start",
      numQuestions: selectedNumQuestions,
      difficulty: selectedDifficulty,
    });
  };

  return (
    <div className="start">
      <h2>Welcome to the React Quiz</h2>
      <h3> Questions to test your React mastery</h3>
      <div className="form-group">
        <label htmlFor="numQuestions">Number of Questions:</label>
        <input
          type="range"
          id="numQuestions"
          value={selectedNumQuestions}
          onChange={(e) => setSelectedNumQuestions(parseInt(e.target.value))}
          min="1"
          max="15" // or any appropriate max value
        />
        <label htmlFor=""> {selectedNumQuestions} </label>
      </div>
      <div className="form-group">
        <label htmlFor="difficulty">Difficulty Level:</label>
        <select
          id="difficulty"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(parseInt(e.target.value))}
        >
          <option value="0">Select Difficulty</option>
          <option value="1">Easy</option>
          <option value="2">Medium</option>
          <option value="3">Hard</option>
        </select>
      </div>
      <button
        className="btn btn-ui"
        onClick={handleStartQuiz}
        disabled={selectedDifficulty === 0}
      >
        Start
      </button>
    </div>
  );
}

export default StartScreen;
