import "../styles/main.scss";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages } from "@/locales/en/messages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

i18n.load("en", messages);
i18n.activate("en");

function App({ Component, pageProps }) {
  return (
    <I18nProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <div className="page">
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </I18nProvider>
  );
}

export default App;
