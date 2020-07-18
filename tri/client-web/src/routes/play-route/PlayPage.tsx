import {useDispatch, useSelector} from "react-redux";
import {autoJoinSession, playerToken, sessionCells, sessionConnected} from "../../app/gameStateSlice";
import React, {useEffect, useState} from "react";
import {GameField} from "../../features/game-field/GameField";
import {useParams} from "react-router-dom";
import {GameIntro} from "../../features/game-intro/GameIntro";
import {BeCaptain} from "../../features/be-captain/BeCaptain";
import useNoSleep from "../../utils/useNoSleep";
import {SettingsDrawer} from "../../features/settings-drawer/SettingsDrawer";


export function PlayPage() {
    useNoSleep(true);

    const {sessionId} = useParams();

    const dispatch = useDispatch();
    const token = useSelector(playerToken);
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionCells);

    const [showSettings, setShowSettings] = useState(false);

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
                <SettingsDrawer open={showSettings} onClose={() => setShowSettings(false)}/>
            </React.Fragment>
            <GameField sessionId={sessionId} onSettingsClick={() => setShowSettings(true)}/>
        </>
        }
    </>
}
