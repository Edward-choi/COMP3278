import NextHead from 'next/head';

const THEME_COLOR_CODE = '#303436';

export function Meta({ title = "", canonical, description, keywords }) {
  return (
    <NextHead>
      <meta charSet="utf-8" />
      <meta content="yes" name="apple-mobile-web-app-capable" />
      <meta content="black" name="apple-mobile-web-app-status-bar-style" />
      <meta content="true" name="HandheldFriendly" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta content={THEME_COLOR_CODE} name="msapplication-TileColor" />
      <meta content={THEME_COLOR_CODE} name="theme-color" />
      <title>{title ? `${title} | Preface` : 'Preface'}</title>
      {canonical && <link href={canonical} rel="canonical" />}
      {description && <meta content={description} name="description" />}
      {keywords && <meta content={keywords} name="keywords" />}
    </NextHead>
  );
}
