import React from "react";
import Show from "./Show";
import Header from "./Header";
import Empty from "./Empty";
import "./styles.scss";

export default function Appointment(props) {
  return (
    <article className="appointment">
      <Header time={props.time} />
      {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer.name} /> : <Empty />}
    </article>
  );
}
