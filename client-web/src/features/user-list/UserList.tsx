import React from 'react';
// @ts-ignore
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {playerSessionId, playerToken, sessionPlayers, startGame} from '../../app/gameStateSlice';
import {JoinLink} from "../link-join/JoinLink";

export function UserList() {
    const dispatch = useDispatch();
    const players = useSelector(sessionPlayers);
    const sessionId = useSelector(playerSessionId)
    const token = useSelector(playerToken)

    const p = players.map((player, i) =>
        <li key={i}>{player.alias}</li>
    );

    return (
        <div>
            <h1>Game Session #{sessionId}</h1>
            <JoinLink/>
            <div className={commonStyles.row}>
                <ul>
                    {p}
                </ul>
            </div>
            <div>
                <button
                    disabled={!sessionId || !token}
                    className={commonStyles.button}
                    onClick={() => dispatch(startGame(token!, sessionId!))}>
                    Start
                </button>
            </div>
        </div>
    );
}
