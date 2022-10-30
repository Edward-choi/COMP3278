import { Footer } from "./Footer";
import { Meta } from "./Meta";

export function Layout({ title, canonical, description, keywords, children }) {
  return (
    <>
      <Meta
        title={title}
        canonical={canonical}
        description={description}
        keywords={keywords}
      />
      {children}
      <Footer
        facebookUrl="https://www.facebook.com/prefacecoding/"
        instagramUrl="https://www.instagram.com/prefacecoding/"
        linkedinUrl="https://bd.linkedin.com/company/preface-ai"
      />
    </>
  );
}
