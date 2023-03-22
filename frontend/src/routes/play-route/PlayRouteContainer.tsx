import {useSelector} from "react-redux";
import {
    joinSession,
    gameCells,
    playerToken,
    sessionNotFound,
    gameSession
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
    const session = useSelector(gameSession);
    const words = useSelector(gameCells);
    const notFound = useSelector(sessionNotFound);

    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        console.log("join", token, session, words, notFound)
        dispatch(joinSession(token, sessionId!));
    });

    return <>
        {notFound &&
        <NotFound sessionId={sessionId!}/>
        }
        {session &&
        <BeCaptain sessionId={sessionId!}/>
        }
        {session && words.length === 0 &&
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
