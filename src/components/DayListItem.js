import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  // console.log("DAYLISTITEM", props)
  let listClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });
  const spotRenderer = param => {
    if (param === 0) {
      return `no spots remaining`;
    } else if (param === 1) {
      return `${param} spot remaining`;
    } else {
      return `${param} spots remaining`;
    }
  };

  return (
    <li
      onClick={() => {
        props.setDay(props.name);
      }}
      className={listClass}
      data-testid="day"
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{spotRenderer(props.spots)}</h3>
    </li>
  );
}
