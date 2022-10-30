import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "./Dropdown";
import { Input } from "./Input";
import { DropdownItem } from "./DropdownItem";

PhoneInput.propTypes = {
  label: PropTypes.string,
  ccc: PropTypes.string,
  phone: PropTypes.string,
  cccList: PropTypes.array,
  onPhoneChange: PropTypes.func,
  onCccChange: PropTypes.func,
};

export function PhoneInput({
  label,
  ccc,
  phone,
  cccList,
  onPhoneChange,
  onCccChange,
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="field has-addons">
        <div className="control">
          <Dropdown itemSelected={ccc} onChange={onCccChange} defaultMessage="">
            {cccList.map((ccc) => (
              <DropdownItem key={ccc} data={ccc}>
                {ccc}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
        <div className="control is-expanded">
          <Input type="tel" value={phone} onChange={onPhoneChange}></Input>
        </div>
      </div>
    </div>
  );
}
