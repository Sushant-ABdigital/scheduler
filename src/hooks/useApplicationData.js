import { useEffect, useReducer } from "react";
import Axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_DAYS = "SET_DAYS";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  //Helper function to update state

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
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.appointments
        };
      case SET_DAYS:
        return {
          ...state,
          days: action.days
        };
      default:
        throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
    }
  }
  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(Axios.get("/api/days")),
      Promise.resolve(Axios.get("/api/appointments")),
      Promise.resolve(Axios.get("/api/interviewers"))
    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
  }, []);

  // //SCOKET
  // useEffect(() => {
  //   const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
  //   socket.onopen = () => {
  //     socket.send("Ping");
  //   };
  //   socket.onmessage = function(event) {
  //     const data = JSON.parse(event.data);
  //     const appointment = {
  //       ...state.appointments[data.id],
  //       interview: { ...data.interview }
  //     };
  //     const appointments = {
  //       ...state.appointments,
  //       [data.id]: appointment
  //     };
  //     // console.log("findDay", findDay);
  //     //NEED TO WORK HERE - MENTOR HELP NEEDED!
  //     // if (data.interview) {
  //     //   // console.log("APPOINTMENTS", appointments);
  //     //   dispatch({
  //     //     type: data.type,
  //     //     appointments
  //     //   });
  //     // }
  //   };
  // }, []);

  //Creating function to book an Interview
  function bookInterview(id, interview) {
    // console.log("interview", interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return Axios.put(`api/appointments/${id}`, { interview })
      .then(
        dispatch({
          type: SET_INTERVIEW,
          appointments
        })
      )
      .then(() => {
        //dayObj gives the object like [{...}], hence we are taking that object out to work on that
        const dayObj = state.days.filter(day => day.name === state.day)[0];
        let day = '';
        if(dayObj.spots !== 0){
          day = { ...dayObj, spots: dayObj.spots - 1 };
        }
        //days will be a new array with updated spot value
        const days = state.days.map(d => {
          if (d.name === day.name) {
            return day;
          }
          return d;
        });
        dispatch({
          type: SET_DAYS,
          days: days
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
    return Axios.delete(`api/appointments/${id}`, { appointments })
      .then(
        dispatch({
          type: SET_INTERVIEW,
          appointments
        })
      )
      .then(() => {
        const dayObj = state.days.filter(day => day.name === state.day)[0];
        const day = { ...dayObj, spots: dayObj.spots + 1 };
        //days will be a new array with updated spot value
        const days = state.days.map(d => {
          if (d.name === day.name) {
            return day;
          }
          return d;
        });
        dispatch({
          type: SET_DAYS,
          days: days
        });
      });
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
