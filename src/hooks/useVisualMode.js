import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    if (replace === true) {
      history.pop();
      history.push(mode);
      setMode(history[history.length - 1]);
    } else {
      history.push(mode);
      setMode(history[history.length - 1]);
    }
  }
  function back() {
    if (mode !== initial) {
      history.pop();
      setMode(history[history.length - 1]);
    }
  }
  return {
    mode,
    transition,
    back
  };
}
//Ultimately useVisualMode returns the mode - that is starting point, a function called transition that 
// will take care of showing/rendering different components and back function tht will just get back to // previous mode OR 'desired' [remeber form-saving-show and form-saving-error] previous mode. 