import React, {useEffect} from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {checkCurrentSession, sessionConnected} from "./app/gameStateSlice";
import {useDispatch, useSelector} from "react-redux";
import {PlayPage} from "./routes/player-route/PlayPage";
import {CreatePage} from "./routes/creator-route/CreatePage";

function App() {
    const dispatch = useDispatch();
    const connected = useSelector(sessionConnected);

    useEffect(() => {
        if (!connected) {
            dispatch(checkCurrentSession());
        }
    });

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Switch>
                        <Route path="/:sessionId">
                            <PlayPage/>
                        </Route>
                        <Route path="/">
                            <CreatePage/>
                        </Route>
                    </Switch>
                </header>
            </div>
        </Router>
    );
}

export default App;
