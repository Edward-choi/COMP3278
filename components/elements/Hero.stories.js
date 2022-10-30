import { Hero } from "./Hero.js";
import { Tag } from "./Tag.js";
import cuteDogImage from "../../public/images/storybooks/476_404_animals.jpg";

export default {
  title: "Elements/Hero",
  component: Hero,
  argTypes: {
    imgSrc: { control: "text" },
    imgAlt: { control: "text" },
    imgWidth: { control: { type: "range", min: 1, max: 2500, step: 1 } },
    imgHeight: { control: { type: "range", min: 1, max: 2500, step: 1 } },
    title: { control: "text" },
    content: { control: "text" },
    buttonLabel: { control: "text" },
    onButtonClick: { action: "Clicked" },
    imgOverlay: { control: "text" },
  },
};

const Template = (args) => <Hero {...args} />;

export const MainHero = Template.bind({});
MainHero.args = {
  imgSrc: cuteDogImage,
  imgAlt: "Cute dog (local import)",
  title: "Save a dog now!",
  content: `Here at SavePuppies.com, we help you, the prospective owner
            looking for a special somebody to give your love to, find the
            puppy of your dreams! All of our dogs are rescued from unpleasant,
            abusive conditions, and are in desperate need for a new home.`,
  buttonLabel: "Adopt or Donate",
  onButtonClick: () => console.log("Thank you for helping!"),
  imgOverlay: <Tag color="warning">Save us now! 🐕🐕🐕</Tag>,
};
