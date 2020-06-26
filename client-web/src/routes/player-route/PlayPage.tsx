import {GameJoin} from "../../features/game-join/GameJoin";
import {useSelector} from "react-redux";
import {sessionCells, sessionConnected} from "../../app/gameStateSlice";
import React from "react";
import {GameField} from "../../features/game-field/GameField";
import {UserList} from "../../features/user-list/UserList";
import {useParams} from "react-router-dom";

export function PlayPage() {
    const {sessionId} = useParams();
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionCells);

    return <>
        {!connected &&
        <GameJoin sessionId={sessionId}/>
        }
        {connected && words.length === 0 &&
        <UserList/>
        }
        {words.length > 0 &&
        <GameField/>
        }
    </>
}
