export function getAppointmentsForDay(state, day) {
  const filteredState = state.days.filter(dayName => dayName.name === day);
  const filteredAppointments = filteredState.length === 0 ? [] : filteredState[0].appointments;
  return filteredAppointments.length === 0
    ? []
    : filteredAppointments.map(appointmentId => state.appointments[appointmentId]);
}

export const getInterview = (state, interview) => {
  if (!interview) {
    return null;
  } else {
    let student = interview.student;
    let interviewer = state.interviewers[interview.interviewer];
    let obj = { student, interviewer };
    return obj;
  }
};

export function getInterviewersForDay(state, day) {
  let currentDay = null;
  const interviewers = [];
  let currentDayInterviews;
  state.days.map(day2 => {
    if (day2.name === day) {
      currentDay = day;
      currentDayInterviews = day2.interviewers || [];
    }
  });
  if (currentDay === null) {
    return [];
  } else {
    for (let i of currentDayInterviews) {
      interviewers.push(state.interviewers[i]);
    }
    return interviewers;
  }
}
