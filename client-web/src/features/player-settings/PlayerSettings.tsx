import React, {useState} from 'react';
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {playerSessionId, playerToken, sessionTeams, setSettings,} from '../../app/gameStateSlice';

export function PlayerSettings() {
    const token = useSelector(playerToken)
    const sessionId = useSelector(playerSessionId)
    const teams = useSelector(sessionTeams)
    const dispatch = useDispatch();

    const [captain, setCaptain] = useState(false);
    const [alias, setAlias] = useState('Andrey');
    const [teamId, setTeamId] = useState(teams[0].id);

    const teamOptions = teams.map((team, index) => (
        <option value={team.id} key={index}>{team.alias}</option>
    ));

    return (
        <div>
            <h1>Settings {sessionId}</h1>
            <div className={commonStyles.row}>
                <input
                    type="checkbox"
                    aria-label="Set sessionId"
                    checked={captain}
                    onChange={e => setCaptain(e.target.checked)}
                />
                <input
                    className={commonStyles.textbox}
                    aria-label="Set player Alias"
                    value={alias}
                    onChange={e => setAlias(e.target.value)}
                />
                <select id="teamId" onChange={e => setTeamId(e.target.value)} value={teamId}>
                    {teamOptions}
                </select>
                <button
                    className={commonStyles.button}
                    onClick={() => dispatch(setSettings(token, sessionId!, alias, captain, teamId))}
                >
                    Update settings
                </button>
            </div>
        </div>
    );
}
