import Image from "next/image";
import PropTypes from "prop-types";

function Img({ src, alt, width, height, layout = "responsive", ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      layout={layout}
      width={width}
      height={height}
      {...props}
    />
  );
}

const layoutList = ["intrinsic", "fixed", "responsive", "fill"];

Img.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  // The width, height are required, except for statically imported images, or those with layout="fill".
  layout: PropTypes.oneOf(layoutList),
  // Ref: https://nextjs.org/docs/api-reference/next/image
};
export { Img };
