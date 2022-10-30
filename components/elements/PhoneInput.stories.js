import { PhoneInput } from "./PhoneInput.js";

export default {
  title: "Elements/PhoneInput",
  component: PhoneInput,
  argTypes: {
    label: { control: "text" },
    ccc: { control: "text" },
    cccList: { odd: { control: "object" } },
    phone: { control: "text" },
    onPhoneChange: { action: "Typed" },
    onCccChange: { action: "Clicked" },
  },
};

const Template = (args) => <PhoneInput {...args} />;
export const MainPhoneInput = Template.bind({});
MainPhoneInput.args = {
  label: "Parent's WhatsApp*",
  cccList: ["+88", "+99"],
};
