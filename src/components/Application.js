import React from "react";
import useApplicationData from "../hooks/useApplicationData";

import DayList from "./DayList";
import Appointment from "components/Appointment";
import "components/Application.scss";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    bookInterviewWithoutSpot
  } = useApplicationData();
  // Getting the interviewefor the day
  const getInterviewerForTheDay = getInterviewersForDay(state, state.day);
  //Getting appointments for the day
  const appointments = getAppointmentsForDay(state, state.day);
  //Writing a function to modify the data and creating the component with desired props
  const schedule = appointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        getInterviewerForTheDay={getInterviewerForTheDay}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        bookInterviewWithoutSpot={bookInterviewWithoutSpot}
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
