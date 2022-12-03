import {useSelector} from "react-redux";
import {
    autoJoinSession,
    gameCells,
    playerToken,
    sessionNotFound,
    sessionStatus,
    StreamStatus
} from "../../app/gameStateSlice";
import React, {useEffect, useState} from "react";
import {GameField} from "../../features/game-field/GameField";
import {useParams} from "react-router-dom";
import {GameIntro} from "../../features/game-intro/GameIntro";
import {BeCaptain} from "../../features/be-captain/BeCaptain";
import useNoSleep from "../../utils/useNoSleep";
import {SettingsDrawer} from "../../features/settings-drawer/SettingsDrawer";
import {NotFound} from "../../features/session-not-found/NotFound";
import {useAppDispatch} from "../../app/store";


export function PlayRouteContainer({setLocale}: { setLocale: (locale: string) => void }) {
    useNoSleep(true);

    const {sessionId} = useParams();

    const dispatch = useAppDispatch();
    const token = useSelector(playerToken);
    const streamStatus = useSelector(sessionStatus);
    const words = useSelector(gameCells);
    const notFound = useSelector(sessionNotFound);

    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        if (streamStatus === StreamStatus.Idle) {
            dispatch(autoJoinSession(token, sessionId!));
        }
    });

    return <>
        {notFound &&
        <NotFound sessionId={sessionId!}/>
        }
        {streamStatus === StreamStatus.Connected &&
        <BeCaptain sessionId={sessionId!}/>
        }
        {streamStatus === StreamStatus.Connected && words.length === 0 &&
        <GameIntro sessionId={sessionId!}/>
        }
        {words.length > 0 &&
        <>
            <React.Fragment key="right">
                <SettingsDrawer open={showSettings} setUILocale={setLocale} onClose={() => setShowSettings(false)}/>
            </React.Fragment>
            <GameField sessionId={sessionId!} onSettingsClick={() => setShowSettings(true)}/>
        </>
        }
    </>
}
