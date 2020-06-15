import React, {useState} from 'react';
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {joinAsync, playerToken,} from '../../app/gameStateSlice';

export function GameJoin({sessionId}: { sessionId: string }) {
    const token = useSelector(playerToken)
    const dispatch = useDispatch();

    const [_sessionId, _setSessionId] = useState(sessionId);
    const [playerName, setPlayerName] = useState('Andrey');

    return (
        <div>
            <h1>Join {sessionId ? "to session #" + sessionId : ""}</h1>
            <div className={commonStyles.row}>
                {!sessionId &&
                <input
                    className={commonStyles.textbox}
                    aria-label="Set sessionId"
                    value={_sessionId}
                    onChange={e => _setSessionId(e.target.value)}
                />}
                <input
                    className={commonStyles.textbox}
                    aria-label="Set player name"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                />
                <button
                    className={commonStyles.button}
                    onClick={() => dispatch(joinAsync(token, sessionId))}
                >
                    Join
                </button>
            </div>
        </div>
    );
}
