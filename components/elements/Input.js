import React from "react";
import PropTypes from "prop-types";

const typeList = ["text", "password", "email", "tel"];

Input.propTypes = {
  type: PropTypes.oneOf(typeList),
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export function Input({ type = "text", name, value, onChange, ...extras }) {
  return (
    <input
      className="input is-hovered is-normal is-rounded is-link control"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      {...extras}
    />
  );
}
