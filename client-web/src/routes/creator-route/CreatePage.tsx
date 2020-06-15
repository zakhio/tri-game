import {useSelector} from "react-redux";
import {sessionConnected, sessionCells} from "../../app/gameStateSlice";
import React from "react";
import {SessionCreate} from "../../features/session-create/SessionCreate";
import {UserList} from "../../features/user-list/UserList";
import {WordTable} from "../../features/wordtable/WordTable";

export function CreatePage() {
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionCells);

    return <>
        {!connected &&
        <SessionCreate/>
        }
        {connected && words.length === 0 &&
        <UserList/>
        }
        {words.length > 0 &&
        <WordTable/>
        }
    </>
}
