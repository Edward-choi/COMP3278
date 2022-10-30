import { Heading } from "./Heading.js";

export default {
  title: "Elements/Heading",
  component: Heading,
  argTypes: {
    label: { control: "text" },
    src: { control: "text" },
  },
};

const Template = (args) => <Heading {...args} />;
export const ImageOverlayHeading = Template.bind({});
ImageOverlayHeading.args = {
  label: "Kids Bootcamp",
  src: "https://picsum.photos/id/237/200/300",
};
