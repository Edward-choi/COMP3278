import React from "react";
import PropTypes from "prop-types";
import styles from "./Stepper.module.css";

Stepper.propTypes = {
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
};

export function Stepper({ totalSteps, currentStep }) {
  const stepperArray = [];
  for (let i = 0; i < totalSteps; i++) {
    stepperArray.push(
      <StepperDash
        key={i}
        whichDash={i + 1}
        currentStep={currentStep}
      ></StepperDash>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {stepperArray}
    </div>
  );
}

function StepperDash({ whichDash, currentStep }) {
  return whichDash === currentStep ? (
    <span className={styles.blackBar} />
  ) : (
    <span className={styles.grayBar} />
  );
}
