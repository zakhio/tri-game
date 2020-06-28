import React from 'react';
// @ts-ignore
import commonStyles from '../Common.module.css';
import {useSelector} from 'react-redux';
import {playerSessionId, sessionPlayers} from '../../app/gameStateSlice';
import {FormattedMessage} from "react-intl";

export function PlayerList() {
    const players = useSelector(sessionPlayers);
    const sessionId = useSelector(playerSessionId)

    const p = players.map((player, i) =>
        <li key={i} className={commonStyles.row}>{player.alias}</li>
    );

    return (
        <div>
            <h1>
                <FormattedMessage id="feature.players.title"
                                  defaultMessage="Players"
                                  description="Title for player list"/>
            </h1>
            <ul>
                {p}
            </ul>
        </div>
    );
}
