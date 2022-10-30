import React, { Children, useState, cloneElement, isValidElement } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { DropdownIcon } from "../icons/DropdownIcon";

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  itemSelected: PropTypes.string,
  onChange: PropTypes.func,
  defaultMessage: PropTypes.string,
};

export function Dropdown({
  children,
  itemSelected,
  onChange,
  defaultMessage = "Select an Item",
}) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const onClick = () => setOpenDropdown(!openDropdown);

  return (
    <div className={clsx("dropdown", openDropdown && "is-active")}>
      <div className="dropdown-trigger" onClick={onClick}>
        <button
          className="button is-primary"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={onClick}
        >
          <span>
            <span>{itemSelected || defaultMessage}</span>
            <DropdownIcon></DropdownIcon>
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child, { onChange });
            }
          })}
        </div>
      </div>
    </div>
  );
}
