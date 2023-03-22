import React, {useState} from 'react';
import './App.css';

import {Route, Routes} from "react-router-dom";
import {PlayRouteContainer} from "./routes/play-route/PlayRouteContainer";
import {IntlProvider} from 'react-intl';

import messages_ru from "./translations/ru.json";
import {HomeRouteContainer} from "./routes/home-route/HomeRouteContainer";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const messages: Record<string, Record<string, string>> = {
  'ru': messages_ru
};

function App() {
  const [locale, _setLocale] = useState(localStorage.getItem("language") || navigator.language.split(/[-_]/)[0]);

  function setLocale(locale: string) {
    localStorage.setItem("language", locale)
    _setLocale(locale);
  }

  return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Routes>
          <Route path="/:sessionId" element={<PlayRouteContainer setLocale={setLocale}/>}/>
          <Route path="/" element={<HomeRouteContainer setLocale={setLocale}/>}/>
        </Routes>
      </IntlProvider>
  );
}

export default App;
