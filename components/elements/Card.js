import Link from "next/link";
import { Img } from "./Img";
import { Title } from "./Title";
import PropTypes from "prop-types";

Card.propTypes = {
  title: PropTypes.string,
  content: PropTypes.node,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string,
  imgWidth: PropTypes.number,
  imgHeight: PropTypes.number,
  href: PropTypes.string,
};

export function Card({
  title,
  content,
  imgSrc,
  imgAlt,
  imgWidth,
  imgHeight,
  href,
}) {
  return (
    <Link href={href}>
      <div className="container is-max-widescreen mt-5 mb-5">
        <div className="card card-shadow">
          <div className="is-flex">
            {imgSrc && (
              <figure className="card-image is-align-self-center is-flex-shrink-4">
                <Img
                  src={imgSrc}
                  alt={imgAlt}
                  layout="intrinsic"
                  width={imgWidth}
                  height={imgHeight}
                />
              </figure>
            )}
            <div className="card-content is-flex-shrink-5">
              <Title>
                <a href={href}>{title}</a>
              </Title>
              <div className="content is-size-7-mobile ">{content}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
