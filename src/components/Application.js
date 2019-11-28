import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import Axios from "axios";
import "components/Application.scss";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";

export default function Application(props) {
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
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({
      ...state,
      appointments
    });
  }

  // Getting the interviewefor the day
  const getInterviewerForTheDay = getInterviewersForDay(state, state.day);
  // console.log("APPLICATION",getInterviewerForTheDay);

  //Getting appointments for the day
  const appointments = getAppointmentsForDay(state, state.day);
  //Writing a function to modify the data and creating the component with desired props
  const schedule = appointments.map(appointment => {
    // console.log(appointment);
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        getInterviewerForTheDay={getInterviewerForTheDay}
        bookInterview={bookInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img className="sidebar--centered" src="images/logo.png" alt="Interview Scheduler" />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment id="last" time="5pm" />
      </section>
    </main>
  );
}
