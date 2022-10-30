import React from "react";
import { IconButton } from "./IconButton";
import { LockIcon } from "../icons/LockIcon";

export default {
  title: "Elements/IconButton",
  component: IconButton,
  argTypes: {
    Icon: { control: "object" },
    buttonLabel: { control: "text" },
    disableButton: { control: "boolean" },
    rounded: { control: "boolean" },
    buttonColor: {
      control: "select",
      options: [
        "primary",
        "link",
        "info",
        "success",
        "warning",
        "danger",
        "dark",
        "text",
      ],
    },
  },
};

const Template = (args) => <IconButton {...args} />;

export const PayNow = Template.bind({});
PayNow.args = {
  disableButton: false,
  buttonLabel: "Pay Now",
  Icon: LockIcon,
};
