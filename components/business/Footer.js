import React from "react";
import { FacebookIcon } from "../icons/FacebookIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { t } from "@lingui/macro";

export function Footer({ facebookUrl, instagramUrl, linkedinUrl }) {
  return (
    <footer className="section">
      <div className="container">
        <div className="is-flex-tablet is-justify-content-between is-align-items-center">
          <p>{t`© ${new Date().getFullYear()} Preface`}</p>
          <div className="py-2 is-hidden-tablet"></div>
          <div className="ml-auto">
            {facebookUrl && (
              <a className="mr-4 is-inline-block" href={facebookUrl}>
                <FacebookIcon />
              </a>
            )}
            {instagramUrl && (
              <a className="mr-4 is-inline-block" href={instagramUrl}>
                <InstagramIcon />
              </a>
            )}
            {linkedinUrl && (
              <a className="is-inline-block" href={linkedinUrl}>
                <LinkedinIcon />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
// backgroundColor, type, state, textColor and onClick is not needed
// Fixed set of colour
