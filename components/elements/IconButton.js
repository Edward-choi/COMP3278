import React from "react";
import PropTypes from "prop-types";
import { Button } from "./Button";

IconButton.propTypes = {
  Icon: PropTypes.object,
  buttonLabel: PropTypes.string,
  disableButton: PropTypes.bool,
  onButtonClick: PropTypes.func,
  rounded: PropTypes.bool,
  buttonColor: PropTypes.oneOf([
    "primary",
    "link",
    "info",
    "success",
    "warning",
    "danger",
    "dark",
    "text",
  ]),
};

function IconButton({
  Icon,
  buttonLabel,
  disableButton,
  onButtonClick,
  rounded,
  buttonColor,
}) {
  return (
    <>
      <Button
        disabled={disableButton}
        onClick={onButtonClick}
        buttonColor={buttonColor}
        rounded={rounded}
      >
        <span className="icon">
          <Icon />
        </span>
        <span>{buttonLabel}</span>
      </Button>
    </>
  );
}

export { IconButton };
