import React, { useState } from "react";
import { Dropdown } from "./Dropdown";
import { DropdownItem } from "./DropdownItem";

export default {
  title: "Elements/Dropdown",
  component: Dropdown,
  argTypes: {
    children: { control: "text" },
    itemSelected: { control: "text" },
    onChange: { action: "Clicked" },
    defaultMessage: { control: "text" },
  },
};

export function DropdownWindow() {
  const [selected, setSelected] = useState("");
  const onChange = (item) => {
    setSelected(item);
  };

  return (
    <Dropdown itemSelected={selected} onChange={onChange}>
      <DropdownItem data="Item 1">Item 1</DropdownItem>
      <DropdownItem data="Item 2">Item 2</DropdownItem>
    </Dropdown>
  );
}
