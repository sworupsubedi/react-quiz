function CancelButton({ dispatch, answer }) {
  if (answer !== null) return null;
  return (
    <button
      className="btn btn-ui"
      onClick={() => dispatch({ type: "restart" })}
    >
      Cancel Quiz
    </button>
  );
}

export default CancelButton;
