export function investigate(state, id, scenario) {
  const test = scenario.tests.find((t) => t.id === id);
  if (
    !test ||
    state.finished ||
    state.opened.includes(id) ||
    test.cost > state.credits
  )
    return state;
  return {
    ...state,
    credits: state.credits - test.cost,
    opened: [...state.opened, id],
  };
}
export const initialState = () => ({ credits: 6, opened: [], finished: false });
export function assess(state, choice, scenario) {
  return {
    correct: choice === scenario.answer,
    controlled: state.opened.includes("trial"),
    supported:
      state.opened.includes("profile") && state.opened.includes("changes"),
  };
}
