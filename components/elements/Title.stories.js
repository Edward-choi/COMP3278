import { Title } from "./Title";
export default {
  title: "Elements/Title",
  component: Title,
  argTypes: {
    children: { control: "text" },
    Component: { control: "text" },
    textColor: { control: { type: "color" } },
    backgroundColor: { control: { type: "color" } },
  },
};

const Template = (args) => <Title {...args} />;

export const DefaultTitle = Template.bind({});
DefaultTitle.args = {
  children: "Lorem Ipsum",
};
