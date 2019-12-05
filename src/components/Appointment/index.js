import React from "react";
import Show from "./Show";
import Header from "./Header";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";
const DELETING = "DELETING";

export default function Appointment(props) {
  
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);
  
  function saveOnly(name, interviewer){
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterviewWithoutSpot(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }
  
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function deleteAppointment() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === CREATE && (
        <Form interviewers={props.getInterviewerForTheDay} onCancel={() => back()} onSave={save} />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={"Do you want to delete the appointment?"}
          onConfirm={() => deleteAppointment()}
          onCancel={() => transition(SHOW)}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewers={props.getInterviewerForTheDay}
          interviewer={props.interview.interviewer.id}
          onCancel={() => back()}
          // onSave={save}
          onSaveonly={saveOnly}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="There was an error while saving" onClose={() => back()} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="There was an error while deleting" onClose={() => back()} />
      )}
      {mode === DELETING && <Status message={"Deleting!!!!!"}/>}
    </article>
  );
}
