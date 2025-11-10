import { useSelector } from "react-redux";
import {
    joinSession,
    gameCells,
    sessionNotFound,
    gameSession,
    isPlayerInGame
} from "../../app/gameStateSlice";
import React, { useEffect, useState } from "react";
import { GameField } from "../../features/game-field/GameField";
import { useParams } from "react-router-dom";
import { GameIntro } from "../../features/game-intro/GameIntro";
import { BeCaptain } from "../../features/be-captain/BeCaptain";
import useNoSleep from "../../utils/useNoSleep";
import { SettingsDrawer } from "../../features/settings-drawer/SettingsDrawer";
import { NotFound } from "../../features/session-not-found/NotFound";
import { useAppDispatch } from "../../app/store";

export function PlayRouteContainer({ setLocale }: { setLocale: (locale: string) => void }) {
    const dispatch = useAppDispatch();
    useNoSleep(true);

    const { sessionId } = useParams();

    const session = useSelector(gameSession);
    const inGame = useSelector(isPlayerInGame);
    const notFound = useSelector(sessionNotFound);
    const cells = useSelector(gameCells);

    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        dispatch(joinSession(sessionId!));
    }, [sessionId]);

    return <>
        {notFound &&
            <NotFound sessionId={sessionId!} />
        }
        {session && !inGame &&
            <BeCaptain sessionId={sessionId!} />
        }
        {session && cells.length === 0 &&
            <GameIntro sessionId={sessionId!} />
        }
        {cells.length > 0 &&
            <>
                <React.Fragment key="right">
                    <SettingsDrawer open={showSettings} setUILocale={setLocale} onClose={() => setShowSettings(false)} />
                </React.Fragment>
                <GameField sessionId={sessionId!} onSettingsClick={() => setShowSettings(true)} />
            </>
        }
    </>
}
