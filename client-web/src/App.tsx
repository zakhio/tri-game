import React, {useEffect} from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {checkCurrentSession, sessionCells, sessionConnected} from "./app/gameStateSlice";
import {useDispatch, useSelector} from "react-redux";
import {PlayPage} from "./routes/player-route/PlayPage";
import {CreatePage} from "./routes/creator-route/CreatePage";
import {elastic as Menu} from "react-burger-menu";
import {PlayerSettings} from "./features/player-settings/PlayerSettings";
import {IntlProvider} from "react-intl";

import messages_en from "./translations/en.json";
import messages_ru from "./translations/ru.json";

const messages: Record<string, Record<string, string>> = {
    'ru': messages_ru,
    'en': messages_en
};
const language = 'ru';//navigator.language.split(/[-_]/)[0];

function App() {
    const dispatch = useDispatch();
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionCells);

    useEffect(() => {
        if (!connected) {
            dispatch(checkCurrentSession());
        }
    });

    return (
        <IntlProvider locale={language} messages={messages[language]}>
            <Router>
                {connected &&
                <Menu outerContainerId={"root"} pageWrapId={"App"} right>
                    {words.length > 0 &&
                    <PlayerSettings/>
                    }
                </Menu>
                }
                <div className="App" id="App">
                    <Switch>
                        <Route path="/create">
                            <CreatePage/>
                        </Route>
                        <Route path="/:sessionId">
                            <PlayPage/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </IntlProvider>
    );
}

export default App;
