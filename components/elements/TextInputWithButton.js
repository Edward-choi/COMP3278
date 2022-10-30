import React from "react";
import PropTypes from "prop-types";
import { Button } from "./Button";
import { Input } from "./Input";

TextInputWithButton.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  buttonLabel: PropTypes.string,
  disableButton: PropTypes.bool,
  onButtonClick: PropTypes.func,
  placeholder: PropTypes.string,
  tips: PropTypes.node,
};

function TextInputWithButton({
  title,
  label,
  value,
  onChange,
  buttonLabel,
  disableButton,
  onButtonClick,
  placeholder,
  tips,
}) {
  const handleOnButtonClick = () => {
    onButtonClick(value);
  };

  return (
    <>
      <label className="label">{title}</label>
      <div className="columns is-gapless">
        <div className="column is-two-thirds">
          <div className="field">
            <div className="control">
              <Input
                className="input is-normal"
                onChange={onChange}
                value={value}
                label={label}
                placeholder={placeholder}
              />
            </div>
          </div>
        </div>
        <div className="column">
          <Button
            disabled={disableButton}
            onClick={handleOnButtonClick}
            buttonColor="dark"
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
      <p>{tips}</p>
    </>
  );
}

export { TextInputWithButton };
