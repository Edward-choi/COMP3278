import { Footer } from "./Footer";
export default {
  title: "Business/Footer",
  component: Footer,
};

const Template = (args) => <Footer {...args} />;

export const WithSocialMediaIcons = Template.bind({});
WithSocialMediaIcons.args = {
  facebookUrl: "https://www.facebook.com/prefacecoding/",
  instagramUrl: "https://www.instagram.com/prefacecoding/",
  linkedinUrl: "https://bd.linkedin.com/company/preface-ai",
};

export const WithoutSocialMediaIcons = Template.bind({});
WithoutSocialMediaIcons.args = {};
