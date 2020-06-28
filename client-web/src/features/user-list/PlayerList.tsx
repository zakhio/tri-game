import React from 'react';
// @ts-ignore
import commonStyles from '../Common.module.css';
import {useSelector} from 'react-redux';
import {playerSessionId, sessionPlayers} from '../../app/gameStateSlice';

export function PlayerList() {
    const players = useSelector(sessionPlayers);
    const sessionId = useSelector(playerSessionId)

    const p = players.map((player, i) =>
        <li key={i} className={commonStyles.row}>{player.alias}</li>
    );

    return (
        <div>
            <h1>Players</h1>
            <ul>
                {p}
            </ul>
        </div>
    );
}
