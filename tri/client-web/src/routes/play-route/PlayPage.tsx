import {useDispatch, useSelector} from "react-redux";
import {autoJoinSession, playerToken, sessionCells, sessionConnected} from "../../app/gameStateSlice";
import React, {useEffect, useState} from "react";
import {GameField} from "../../features/game-field/GameField";
import {useParams} from "react-router-dom";
import {GameIntro} from "../../features/game-intro/GameIntro";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {BeCaptain} from "../../features/be-captain/BeCaptain";
import useNoSleep from "../../utils/useNoSleep";


export function PlayPage() {
    useNoSleep(true);

    const {sessionId} = useParams();

    const [showSettings, setShowSettings] = useState(false);

    const dispatch = useDispatch();

    const token = useSelector(playerToken);
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionCells);

    useEffect(() => {
        if (!connected) {
            dispatch(autoJoinSession(token, sessionId));
        }
    });

    return <>
        {connected &&
        <BeCaptain sessionId={sessionId}/>
        }
        {connected && words.length === 0 &&
        <GameIntro sessionId={sessionId}/>
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
            <GameField sessionId={sessionId} onSettings={() => setShowSettings(true)}/>
        </>
        }
    </>
}
