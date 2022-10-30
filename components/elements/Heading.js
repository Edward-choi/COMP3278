import React from "react";
import PropTypes from "prop-types";
import styles from "./Heading.module.css";

export function Heading({ label, src }) {
  return (
    <div className={styles.container}>
      <picture>
        <source srcSet={src} />
        <img className={styles.img} src={src} alt={label}></img>
      </picture>
      <div className={styles.containerText}>
        <span>{label}</span>
      </div>
    </div>
  );
}

Heading.PropTypes = {
  label: PropTypes.string,
  src: PropTypes.string,
};
