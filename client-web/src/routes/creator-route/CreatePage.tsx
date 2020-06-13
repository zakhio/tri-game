import {useSelector} from "react-redux";
import {sessionConnected, sessionWords} from "../../app/gameStateSlice";
import React from "react";
import {GameCreate} from "../../features/game-create/GameCreate";
import {UserList} from "../../features/user-list/UserList";
import {WordTable} from "../../features/wordtable/WordTable";

export function CreatePage() {
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionWords);

    return <>
        {!connected &&
        <GameCreate/>
        }
        {connected && words.length === 0 &&
        <UserList/>
        }
        {words.length > 0 &&
        <WordTable/>
        }
    </>
}
