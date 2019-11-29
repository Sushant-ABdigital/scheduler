import { useState, useEffect, useReducer } from "react";
import Axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  //Helper function to update state
  const setDay = day => setState({ ...state, day });
  useEffect(() => {
    Promise.all([
      Promise.resolve(Axios.get("http://localhost:8001/api/days")),
      Promise.resolve(Axios.get("http://localhost:8001/api/appointments")),
      Promise.resolve(Axios.get("http://localhost:8001/api/interviewers"))
    ]).then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
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
    return Axios.put(`api/appointments/${id}`, { interview }).then(
      setState({
        ...state,
        appointments
      })
    );
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
      setState({
        ...state,
        appointments
      })
    );
  }
  return{
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}
