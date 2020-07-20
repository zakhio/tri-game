import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {PlayRouteContainer} from "./routes/play-route/PlayRouteContainer";
import {IntlProvider} from 'react-intl';

import messages_ru from "./translations/ru.json";
import {JoinRouteContainer} from "./routes/join-route/JoinRouteContainer";

const messages: Record<string, Record<string, string>> = {
    'ru': messages_ru
};
const language = navigator.language.split(/[-_]/)[0];

function App() {
    return (
        <IntlProvider locale={language} messages={messages[language]}>
            <Router>
                <Switch>
                    <Route path="/:sessionId">
                        <PlayRouteContainer/>
                    </Route>
                    <Route path="/">
                        <JoinRouteContainer/>
                    </Route>
                </Switch>
            </Router>
        </IntlProvider>
    );
}

export default App;
