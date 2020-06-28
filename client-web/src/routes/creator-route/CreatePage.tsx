import {useSelector} from "react-redux";
import {sessionCells, sessionConnected} from "../../app/gameStateSlice";
import React from "react";
import {SessionCreate} from "../../features/session-create/SessionCreate";
import {PlayerList} from "../../features/user-list/PlayerList";
import {GameField} from "../../features/game-field/GameField";

export function CreatePage() {
    const connected = useSelector(sessionConnected);
    const words = useSelector(sessionCells);

    return <>
        {!connected &&
        <SessionCreate/>
        }
        {connected && words.length === 0 &&
        <PlayerList/>
        }
        {words.length > 0 &&
        <GameField/>
        }
    </>
}
