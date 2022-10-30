import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

export function Popup({ children, open, onClose }) {
  return (
    <div className={clsx("modal", open && "is-active")}>
      <div
        className="modal-background has-background-danger"
        onClick={onClose}
      ></div>
      <div className="modal-content has-background-white">
        <div className="modal-card">
          <div className="modal-card-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

Popup.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
