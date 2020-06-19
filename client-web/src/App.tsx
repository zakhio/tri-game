import React, {useEffect} from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {checkCurrentSession, sessionCells, sessionConnected} from "./app/gameStateSlice";
import {useDispatch, useSelector} from "react-redux";
import {PlayPage} from "./routes/player-route/PlayPage";
import {CreatePage} from "./routes/creator-route/CreatePage";
import {elastic as Menu} from "react-burger-menu";
import {PlayerSettings} from "./features/player-settings/PlayerSettings";

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
        <Router>
            <Menu outerContainerId={"root"} pageWrapId={"App"} right>
                {connected && words.length > 0 &&
                <PlayerSettings/>
                }
            </Menu>
            <div className="App" id="App">
                <Switch>
                    <Route path="/:sessionId">
                        <PlayPage/>
                    </Route>
                    <Route path="/">
                        <CreatePage/>
                    </Route>
                </Switch>
            </div>

        </Router>
    );
}

export default App;
