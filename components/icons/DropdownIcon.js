import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const DropdownIcon = () => {
  return (
    <FontAwesomeIcon
      icon={faAngleDown}
      style={{ color: "grey" }}
      className="pl-2"
    />
  );
};
