import React from "react";
import { Img } from "./Img";
import { Title } from "./Title";
import { Button } from "./Button";
import PropTypes from "prop-types";

Hero.propTypes = {
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string,
  imgWidth: PropTypes.number,
  imgHeight: PropTypes.number,
  title: PropTypes.string,
  content: PropTypes.node,
  buttonLabel: PropTypes.string,
  onButtonClick: PropTypes.func,
  imgOverlay: PropTypes.element,
};

function Hero({
  imgSrc,
  imgAlt,
  imgWidth,
  imgHeight,
  title,
  content,
  buttonLabel,
  onButtonClick,
  imgOverlay,
  ...extras
}) {
  return (
    <section className="hero is-primary">
      <div className="hero-body">
        {imgSrc && (
          <figure className="image py-0">
            <Img
              src={imgSrc}
              alt={imgAlt}
              layout="responsive"
              width={imgWidth}
              height={imgHeight}
              {...extras}
            />
            {imgOverlay && <div className="is-overlay p-5">{imgOverlay}</div>}
          </figure>
        )}
        <div className="content pt-5">
          <Title textColor="secondary">{title}</Title>
          <p>{content}</p>
        </div>
        {buttonLabel && (
          <Button buttonColor="link" onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        )}
      </div>
    </section>
  );
}

export { Hero };
