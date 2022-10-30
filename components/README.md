# Where should I put my components?

- There are 3 type of components in this repository
  - **Business Component** (`components/business`)
  - **Element Component** (`components/elements`)
  - **Icon Component** (`components/icons`)
    > Notes: Such namings are not industrial standards. They are coined for the sake of simplicity within our context.
- :deciduous_tree: Decision tree:
  - is it just a Icon?
    - :white_check_mark: Yes -> `components/icons`
      > e.g. `components/icons/FacebookIcon.js`
    - :x: No ->
      - Does it contain Preface Domain specific logic?
        > e.g. Contain Preface related Copywriting
        - :white_check_mark: Yes -> `/business` aka Business Component
          > e.g. `components/business/Meta.js` (contain Preface content)
        - :x: No -> `/elements` aka Element Component
          > e.g. `components/elements/Img.js` (Just a wrapper to next/image)
- Notes:
  - sometimes a Business Component can be demoted to Element Component by extracting all Business knowledge as its Props
  - For Example: The `business/Footer` component can move to `elements/Footer` if the Brand name at Copyright declaimer convert to a props instead of hard-coded, like this:
    ```js
    <Footer
      brandName="Preface"
      facebookUrl="https://www.facebook.com/prefacecoding/"
      instagramUrl="https://www.instagram.com/prefacecoding/"
      linkedinUrl="https://bd.linkedin.com/company/preface-ai"
    />
    ```
  - One of the intention doing this is to share particular component in other context. You have full control to decide whether a component should be Business or Element(by designing what should be included at the Props interface).
  - For the Footer component case, we don't see any opportunity to reuse this component in other context so there are not much value demoting it to Element Component.
