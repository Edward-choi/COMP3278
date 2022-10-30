import { Input, typeList } from "./Input";
export default {
  title: "Elements/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: typeList,
    },
    name: { control: "text" },
    value: { control: "text" },
    onChange: { action: "Typed" },
  },
};

const Template = (args) => <Input {...args} />;

export const GeneralInput = Template.bind({});
