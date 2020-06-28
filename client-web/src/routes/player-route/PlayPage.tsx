import {SessionJoin} from "../../features/session-join/SessionJoin";
import {useDispatch, useSelector} from "react-redux";
import {autoJoinSession, playerToken, sessionCells, sessionConnected, sessionMe} from "../../app/gameStateSlice";
import React, {useEffect} from "react";
import {GameField} from "../../features/game-field/GameField";
import {useParams} from "react-router-dom";
import {GameIntro} from "../../features/game-intro/GameIntro";

export function PlayPage() {
    const {sessionId} = useParams();

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
        <GameField/>
        }
    </>
}
