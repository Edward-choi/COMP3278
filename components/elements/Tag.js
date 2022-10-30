import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

function Tag({ children, color, size }) {
  return (
    <span
      className={clsx(
        "tag is-rounded",
        color && `is-${color}`,
        size && `size-${size}`
      )}
    >
      {children}
    </span>
  );
}

const colorList = [
  "black",
  "dark",
  "light",
  "white",
  "primary",
  "link",
  "info",
  "success",
  "warning",
  "danger",
];

const sizeList = ["small", "medium", "large"];

Tag.propTypes = {
  children: PropTypes.string,
  color: PropTypes.oneOf(colorList),
  size: PropTypes.oneOf(sizeList),
};

export { Tag };
