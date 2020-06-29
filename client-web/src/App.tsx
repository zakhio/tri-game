import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {sessionCells, sessionConnected} from "./app/gameStateSlice";
import {useSelector} from "react-redux";
import {PlayPage} from "./routes/player-route/PlayPage";
import {CreatePage} from "./routes/creator-route/CreatePage";
import {elastic as Menu} from "react-burger-menu";
import {PlayerSettings} from "./features/player-settings/PlayerSettings";
import {IntlProvider} from "react-intl";

import messages_en from "./translations/en.json";
import messages_ru from "./translations/ru.json";
import {JoinPage} from "./routes/join-route/JoinPage";

const messages: Record<string, Record<string, string>> = {
    'ru': messages_ru,
    'en': messages_en
};
const language = 'ru';//navigator.language.split(/[-_]/)[0];

function App() {
    return (
        <IntlProvider locale={language} messages={messages[language]}>
            <Router>
                <div className="App" id="App">
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
                </div>
            </Router>
        </IntlProvider>
    );
}

export default App;
