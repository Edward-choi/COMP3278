import { Img, layoutList } from "./Img";
import cuteDogImage from "../../public/images/storybooks/476_404_animals.jpg";
import largeBookImage from "../../public/images/storybooks/1920_2880_book.jpg";
export default {
  title: "Elements/Img",
  component: Img,
  argTypes: {
    src: { control: "text" },
    alt: { control: "text" },
    width: { control: { type: "range", min: 1, max: 2500, step: 1 } },
    height: { control: { type: "range", min: 1, max: 2500, step: 1 } },
    layout: {
      control: "select",
      options: layoutList,
    },
  },
};

const Template = (args) => <Img {...args} />;

export const ImportImage = Template.bind({});
ImportImage.args = {
  src: cuteDogImage,
  alt: "Cute dog(imported locally)",
};

export const RemoteImage = Template.bind({});
RemoteImage.args = {
  src: "https://res.cloudinary.com/preface/image/upload/v1633826301/r2021/assets/images/storybook/476_360_nature.jpg",
  alt: "Cute dog(remote image)",
  width: 476,
  height: 404,
};
RemoteImage.parameters = {
  docs: {
    description: {
      story:
        "If this is remote image, width and height are required except when `layout` is `fill`",
    },
  },
};

export const BlurOnLoad = Template.bind({});
BlurOnLoad.args = {
  src: largeBookImage,
  alt: "Book(large image)",
  placeholder: "blur",
};
