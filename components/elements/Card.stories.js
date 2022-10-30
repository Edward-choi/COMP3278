import { Card } from "./Card";
import cuteDogImage from "../../public/images/storybooks/476_404_animals.jpg";

export default {
  title: "Elements/Card",
  component: Card,
  argTypes: {
    title: { control: "text" },
    content: { control: "text" },
    imgSrc: { control: "text" },
    imgAlt: { control: "text" },
    imgWidth: { control: { type: "range", min: 1, max: 2500, step: 1 } },
    imgHeight: { control: { type: "range", min: 1, max: 2500, step: 1 } },
    href: { control: "object" },
  },
};

const Template = (args) => <Card {...args} />;

export const DefaultCard = Template.bind({});
DefaultCard.args = {
  title: "Save a puppy here!",
  content: `Here at SavePuppies.com, we help you, the prospective owner 
            looking for a special somebody to give your love to, find the 
            puppy of your dreams! All of our dogs are rescued from unpleasant,
            abusive conditions, and are in desperate need for a new home.`,
  imgSrc: cuteDogImage,
  imgAlt: "Cute dog(local import)",
  href: "https://github.com/prefacecoding/",
};
