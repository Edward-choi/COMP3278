import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

function Button({ rounded, buttonColor, onClick, type, children, ...extras }) {
  return (
    <button
      className={clsx(
        "button is-fullwidth",
        rounded && "is-rounded",
        buttonColor && `is-${buttonColor}`
      )}
      onClick={onClick}
      type={type || "button"}
      {...extras}
    >
      {children}
    </button>
  );
}

const buttonColorList = [
  "primary",
  "link",
  "info",
  "success",
  "warning",
  "danger",
  "dark",
  "text",
];

const typeList = ["submit", "reset", "button"];

Button.propTypes = {
  rounded: PropTypes.bool,
  buttonColor: PropTypes.oneOf(buttonColorList),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(typeList),
  children: PropTypes.node.isRequired,
};
export { Button };
