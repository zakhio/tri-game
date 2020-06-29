import {SessionJoin} from "../../features/session-join/SessionJoin";
import {useDispatch, useSelector} from "react-redux";
import {autoJoinSession, playerToken, sessionCells, sessionConnected, sessionMe} from "../../app/gameStateSlice";
import React, {useEffect, useState} from "react";
import {GameField} from "../../features/game-field/GameField";
import {useParams} from "react-router-dom";
import {GameIntro} from "../../features/game-intro/GameIntro";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";


export function PlayPage() {
    const {sessionId} = useParams();

    const [showSettings, setShowSettings] = useState(false);

    const dispatch = useDispatch();

    const token = useSelector(playerToken);
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionCells);
    const me = useSelector(sessionMe);

    useEffect(() => {
        if (!connected) {
            dispatch(autoJoinSession(token, sessionId));
        }
    });

    return <>
        {connected && !(me) &&
        <SessionJoin sessionId={sessionId}/>
        }
        {connected && words.length === 0 &&
        <GameIntro/>
        }
        {words.length > 0 &&
        <>
            <React.Fragment key="right">
                <Drawer anchor="right" open={showSettings} onClose={() => setShowSettings(false)}>
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemText primary={text}/>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </React.Fragment>
            <GameField onSettings={() => setShowSettings(true)}/>
        </>
        }
    </>
}
