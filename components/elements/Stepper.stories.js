import { Stepper } from "./Stepper";

export default {
  title: "Elements/Stepper",
  component: Stepper,
  argTypes: {
    totalSteps: { control: "number" },
    currentStep: { control: "number" },
  },
};

const Template = (args) => <Stepper {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  totalSteps: 5,
  currentStep: 2,
};
