import {SessionJoin} from "../../features/session-join/SessionJoin";
import {useSelector} from "react-redux";
import {sessionCells, sessionConnected} from "../../app/gameStateSlice";
import React from "react";
import {GameField} from "../../features/game-field/GameField";
import {useParams} from "react-router-dom";
import {GameIntro} from "../../features/game-intro/GameIntro";

export function PlayPage() {
    const {sessionId} = useParams();
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionCells);

    return <>
        {!connected &&
        <SessionJoin sessionId={sessionId}/>
        }
        {connected && words.length === 0 &&
        <GameIntro/>
        }
        {words.length > 0 &&
        <GameField/>
        }
    </>
}
