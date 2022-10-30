import React from "react";
import { TextInputWithButton } from "./TextInputWithButton";

export default {
  title: "Elements/TextInputWithButton",
  component: TextInputWithButton,
  argTypes: {
    title: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
    onChange: { action: "Change" },
    buttonLabel: { control: "text" },
    disableButton: { control: "boolean" },
    onButtonClick: { action: "text" },
    placeholder: { control: "text" },
    tips: { control: "text" },
  },
};

const Template = (args) => <TextInputWithButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  disableButton: false,
  tips: "Discount applied",
  title: "Discount code",
  buttonLabel: "Apply",
  placeholder: "Allow only: a-z,0-9, _, -, .",
};
