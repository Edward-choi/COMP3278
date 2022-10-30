import React from "react";
import { Button, buttonColorList, typeList } from "./Button";

export default {
  title: "Elements/Button",
  component: Button,
  argTypes: {
    rounded: { control: "boolean" },
    buttonColor: {
      control: "select",
      options: buttonColorList,
    },
    onClick: { action: "Clicked" },
    type: {
      control: "select",
      options: typeList,
    },
    children: { control: "text" },
  },
};

const ButtonTemplate = (args) => <Button {...args} />;

export const PrimaryButton = ButtonTemplate.bind({});
PrimaryButton.args = {
  buttonColor: "primary",
  children: "Primary",
};

export const LinkButton = ButtonTemplate.bind({});
LinkButton.args = {
  buttonColor: "link",
  children: "Link",
};

export const InfoButton = ButtonTemplate.bind({});
InfoButton.args = {
  buttonColor: "info",
  children: "Info",
};
export const SuccessButton = ButtonTemplate.bind({});
SuccessButton.args = {
  buttonColor: "success",
  children: "Success",
};
export const WarningButton = ButtonTemplate.bind({});
WarningButton.args = {
  buttonColor: "warning",
  children: "Warning",
};

export const DangerButton = ButtonTemplate.bind({});
DangerButton.args = {
  buttonColor: "danger",
  children: "Danger",
};
export const DarkButton = ButtonTemplate.bind({});
DarkButton.args = {
  buttonColor: "dark",
  children: "Dark",
};
export const TextButton = ButtonTemplate.bind({});
TextButton.args = {
  buttonColor: "text",
  children: "Text",
};

export const SubmitButton = ButtonTemplate.bind({});
SubmitButton.args = {
  type: "submit",
  children: "Submit",
};

export const ResetButton = ButtonTemplate.bind({});
ResetButton.args = {
  type: "reset",
  children: "Reset",
};
