import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {PlayPage} from "./routes/player-route/PlayPage";
import {CreatePage} from "./routes/creator-route/CreatePage";
import {IntlProvider} from "react-intl";

import messages_ru from "./translations/ru.json";
import {JoinPage} from "./routes/join-route/JoinPage";

const messages: Record<string, Record<string, string>> = {
    'ru': messages_ru
};
const language = 'ru';//navigator.language.split(/[-_]/)[0];

function App() {
    return (
        <IntlProvider locale={language} messages={messages[language]}>
            <Router basename="/tri/">
                <Switch>
                    <Route path="/create">
                        <CreatePage/>
                    </Route>
                    <Route path="/:sessionId">
                        <PlayPage/>
                    </Route>
                    <Route path="/">
                        <JoinPage/>
                    </Route>
                </Switch>
            </Router>
        </IntlProvider>
    );
}

export default App;
