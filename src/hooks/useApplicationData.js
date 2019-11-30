import { useState, useEffect, useReducer } from "react";
import Axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const DECREMENT_SPOTS = "DECREMENT_SPOTS";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  //Helper function to update state
  // const day = state.days.find(day => (day.name = state.day));
  const setDay = day => dispatch({ type: SET_DAY, day });

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.day
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW: {
        return {
          ...state,
          appointments: action.appointments
        };
      }
      default:
        throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
    }
  }

  useEffect(() => {
    Promise.all([
      Promise.resolve(Axios.get("http://localhost:8001/api/days")),
      Promise.resolve(Axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(Axios.get("http://localhost:8001/api/interviewers"))
    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
  }, []);

  //Creating function to book an Interview
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const day = state.days.find(day => (day.name = state.day));
    return Axios.put(`api/appointments/${id}`, { interview }).then(() => {
      console.log("day is", day);
      console.log("Just before then");
      dispatch({
        type: SET_INTERVIEW,
        appointments
      });
    });
  }

  //Creating the function to Delete the appointment
  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return Axios.delete(`api/appointments/${id}`, { appointments }).then(
      dispatch({
        type: SET_INTERVIEW,
        appointments
      })
    );
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}

// //Creating a function to update the state - spots
// function decrementSpot() {
//   console.log("state", state);
//   let updatedDay = '';
//   state.days.map(day => {
//     if (day.name === state.day) {
//       const newSpot = day.spots - 1;
//       updatedDay = { ...day, spots: newSpot };
//       return updatedDay;
//     }
//   });
//   // if(id === )
//   console.log(...state.days);
//   return {...state.days, ...updatedDay}
// }

// console.log(decrementSpot());
