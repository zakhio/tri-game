import {GameJoin} from "../../features/game-join/GameJoin";
import {useSelector} from "react-redux";
import {sessionConnected, sessionWords} from "../../app/gameStateSlice";
import React from "react";
import {WordTable} from "../../features/wordtable/WordTable";
import {UserList} from "../../features/user-list/UserList";
import {useParams} from "react-router-dom";

export function PlayPage() {
    const {sessionId} = useParams();
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionWords);

    return <>
        {!connected &&
        <GameJoin sessionId={sessionId}/>
        }
        {connected && words.length === 0 &&
        <UserList/>
        }
        {words.length > 0 &&
        <WordTable/>
        }
    </>
}
