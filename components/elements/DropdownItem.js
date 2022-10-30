import React from "react";
import PropTypes from "prop-types";

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.string,
  onChange: PropTypes.func,
};

export function DropdownItem({ children, data, onChange }) {
  return (
    <a className="dropdown-item" data={data} onClick={() => onChange(data)}>
      {children}
    </a>
  );
}
