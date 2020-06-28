import React, {useState} from 'react';
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {joinAsync, playerToken, setSettings,} from '../../app/gameStateSlice';
import {FormattedMessage} from 'react-intl';

export function SessionJoin({sessionId}: { sessionId: string }) {
    const token = useSelector(playerToken)
    const dispatch = useDispatch();

    const [_sessionId, _setSessionId] = useState(sessionId);
    const [playerName, setPlayerName] = useState('Andrey');

    return (
        <div>
            <h1>
                <FormattedMessage id="page.join.title"
                                  defaultMessage="Join #{sessionId} session"
                                  description="Welcome title on join game session page"/>
            </h1>
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
                    onClick={() => {
                        dispatch(joinAsync(token, sessionId));
                        dispatch(setSettings(token, sessionId, playerName));
                    }}>
                    <FormattedMessage id="page.join.button"
                                      defaultMessage="Join"
                                      description="Button on join game session page"/>
                </button>
            </div>
        </div>
    );
}
