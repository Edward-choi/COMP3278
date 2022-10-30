import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

function Title({ children, Component = "h1", textColor, backgroundColor }) {
  return (
    <Component
      className={clsx(
        "title is-size-5-mobile has-text-left has-text-weight-bold is-family-sans-serif pb-2",
        textColor && `has-text-${textColor}`,
        backgroundColor && `has-text-${backgroundColor}`
      )}
    >
      {children}
    </Component>
  );
}

Title.propTypes = {
  children: PropTypes.node,
  Component: PropTypes.elementType,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export { Title };
