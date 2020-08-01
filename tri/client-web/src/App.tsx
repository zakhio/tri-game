import React, {useState} from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {PlayRouteContainer} from "./routes/play-route/PlayRouteContainer";
import {IntlProvider} from 'react-intl';

import messages_ru from "./translations/ru.json";
import {HomeRouteContainer} from "./routes/home-route/HomeRouteContainer";

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
            <Router>
                <Switch>
                    <Route path="/:sessionId">
                        <PlayRouteContainer setLocale={setLocale}/>
                    </Route>
                    <Route path="/">
                        <HomeRouteContainer setLocale={setLocale}/>
                    </Route>
                </Switch>
            </Router>
        </IntlProvider>
    );
}

export default App;
