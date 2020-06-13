import React from 'react';
// @ts-ignore
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {playerSessionId, playerToken, sessionPlayers, startGame} from '../../app/gameStateSlice';
import {ClipboardText} from "../clipboard-text/ClipboardText";
import {gameSessionUrl} from "../../app/config";

export function UserList() {
    const dispatch = useDispatch();
    const players = useSelector(sessionPlayers);
    const sessionId = useSelector(playerSessionId)
    const token = useSelector(playerToken)

    const p = players.map((player, i) =>
        <li key={i}>{player.name}</li>
    );

    return (
        <div>
            <h1>Game Session #{sessionId}</h1>
            <ClipboardText link={gameSessionUrl(sessionId!)}/>
            <div className={commonStyles.row}>
                <ul>
                    {p}
                </ul>
            </div>
            <div>
                <button
                    disabled={!sessionId || !token}
                    className={commonStyles.button}
                    onClick={() => dispatch(startGame(sessionId!, token!))}>
                    Start
                </button>
            </div>
        </div>
    );
}
