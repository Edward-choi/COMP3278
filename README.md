# preface-subscription-frontend

# Initial Setup

## Prerequest

- Install [Node.js](https://nodejs.org/en/download/)
- Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Install all packages and dependency

- At root directory of this project, run this:
  ```bash
  npm install
  ```

# Development

## :globe_with_meridians: Start the website application

- At root directory of this project, run this:
  ```bash
  npm run dev
  ```
- you should be able to access the application via broweser

## :books: Start the Storybook

- At root directory of this project, run this:
  ```bash
  npm run storybook
  ```
- you should be able to access the Storybook via broweser

## :earth_asia: Locale/ Translations/ i18n handling

- For all copywriting, We need to support internationalization(i18n).

### Usage of t``

- prefer using `t` due to its simplicity, like this:

```js
import { t } from "@lingui/macro";
// ...
return (
  <div className="container">
    <div>{t`Welcome ${customer.name}!`}</div>
    {/* ... */}
    <div className="card">
      <div className="card-header">{t`${credits} Credits`}</div>
    </div>
  </div>
);
```

- behind the scenes, it will get transformed into msgid "Welcome {0}!"
- see more examples at: https://lingui.js.org/ref/macro.html

### Usage of `<Trans/>`

- If the translation scenerios include nested components, consider using <Trans/>, like this:

```js
import { Trans } from "@lingui/macro";
// ...
return (
  <Trans>
    Check out our <Link to="/blog">Blog post</Link>! You can get 10% offer!
  </Trans>
);
```

- behind the scenes, it will get transformed into this msgid

```
Check out our <0>Blog post</0>! You can get 10% offer!
```

### Extract translations and compile before PR

- As of now, we only support English. So
  - The msgid are the actual translated message already
  - We only need to extract the translated message and compile directly before submitting your translation changes:
    - **Step 1**: extract and remove unused translations to locales/{lang}/messages.po files
      ```shell
      npm run locale:extract-clean
      ```
    - **Step 2**: since there are no translations work needed(msgid is the message itself), we just compile it to locales/{lang}/messages.js directly
      ```shell
      npm run locale:compile
      ```
- In case we support more languages, we should provide the msgstr for other languages also, like this:
  - **Step 1**: Extract the translations to all locales/{lang}/messages.po files
    ```shell
    npm run locale:extract-clean
    ```
  - if there are translation changes in English version ->
    - it's better to use `npm run locale:extract` which keep the unused msgid for reference.
    - Please remove unused msgid yourself before PR
  - **Step 2**: Provide the missed msgstr for other languages under locales/{lang}/messages.po
  - **Step 3**: Compile!
    ```shell
    npm run locale:compile
    ```

## :mag: Analyze bundle size

- Run this to do a bundle size health check on both server-side and client-side code
- Ideally, the bundle size(client side) should be < 300kb(gzip compressed).
  - You can find the gzipped size in side menu of the report page.
  - Please bring up the discussion to the team if you find it > 300kb(gzip compressed).
- suggest running the command whenever you try to install new package from npm.

---

# Coding Standard

## Components Grouping

`Page Component` > `Section Component` > `Business Component` > `Element Component`

Component that is higher-level can contain any components in lower level.
For examples, a Page component can be composed by Section components, Business components & Element components.

### Page Component

- Location: `pages/`
- Special File naming convention based on Next.js
  - ref: https://nextjs.org/docs/basic-features/pages
- Same Page concept from next.js framework
- Can be composed by Section, Business & Element components.
- Served as a controller of the page
  - All Cross Section components interaction **MUST** take place within this layer.
  - All routing manipulation **MUST** take place within this layer, e.g. `Router.replace()`
  - All Query/mutation/direct API operation **MUST** take place within this layer.
- No need to define Storybook

### Section Component

- Location: `components/sections/`
- Import example:
  ```js
  import { CourseListSection } from "@/components/sections/CourseListSection";
  ```
- Special Naming convention: always suffix Component name with `Section`.
- Each logical section within a page should be promoted into a Section component
- Can be composed by Business & Element components.
- Allow using `<Link>` component to route to other pages
- Allow having business knowledge & copywriting
  - e.g. can use `<Trans>` component & `t` method
- Must define Storybook
- If there are need to introduce more component for that Section but they are not really sharable across others, we may consider grouping them like this:

```
components/sections
 |- NormalSection.js << contain a regular section component
 |- RichSection/
     |- index.js << contain the actual RichSection component
     |- SomeComponentA.js << component that only being used by RichSection
     |- SomeComponentB.js << component that only being used by RichSection
```

### Business Component

- Location: `components/business/`
- Import example:
  ```js
  import { Layout } from "@/components/business/Layout";
  ```
- Components that
  - contain business logic(e.g. own copywriting)
  - You want it to be shared across Page or Section components
- Avoid promoting UI logic to Business Component too early. most of the time, it's ok to just let them be part of the Section component.
- Must define Storybook

### Element Component

- Location: `components/elements/`
- Import example:
  ```js
  import { Button } from "@/components/elements/Button";
  ```
- All Building block component
- Perfer stateles component over stateful.
- Should not contain any business logic
  - no `<Trans>` component and no `t` methods
- Should not contain any route knowledge
  - no `Router.replace()`
  - can still contain `<Link>` component but its href MUST be exposed as props
- Must define Storybook

## Use Named Export instead of Default Export

The goal is to make renaming of import more consciously

```js
// ✅ export Functional component via named export
export function Xxx() {
  // ...
}

// Most of the time, we don't want to rename it.
// the name must be matched.
import { Xxx } from "./Xxx";

// In case we really need to rename it due to naming collisions,
// we can still do it in a more expressive way
import { Xxx as XxxSomething } from "./Xxx";

// ❌ No good
export default function Xxx() {
  // ...
}
// because import can be rename implictitly.
import Yyy from "./Xxx";
```


