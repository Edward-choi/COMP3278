import { Tag, colorList, sizeList } from "./Tag";
export default {
  title: "Elements/Tag",
  component: Tag,
  argTypes: {
    children: { control: "text" },
    color: {
      control: "select",
      options: colorList,
    },
  },
  size: {
    control: "select",
    options: sizeList,
  },
};

const Template = (args) => <Tag {...args} />;

export const ActiveTag = Template.bind({});
ActiveTag.args = {
  children: "Active",
  color: "success",
};
