import React, {useState} from 'react';
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {playerSessionId, playerToken, sessionMe, sessionTeams, setSettings,} from '../../app/gameStateSlice';

export function PlayerSettings() {
    const token = useSelector(playerToken)
    const sessionId = useSelector(playerSessionId)
    const teams = useSelector(sessionTeams)
    const me = useSelector(sessionMe)
    const dispatch = useDispatch();

    const [captain, setCaptain] = useState(me!.captain);
    const [alias, setAlias] = useState(me!.alias);
    const [teamId, setTeamId] = useState(me!.teamid);
    if (!teamId) {
        setTeamId(teams[0].id)
    }

    const teamOptions = teams.map((team, index) => (
        <option value={team.id} key={index}>{team.alias}</option>
    ));

    return (
        <div>
            <h1>
                Game #{sessionId}
            </h1>
            <div className={commonStyles.row}>
                <input
                    type="checkbox"
                    aria-label="Set captain flag"
                    checked={captain}
                    onChange={e => setCaptain(e.target.checked)}
                />
            </div>
            <div className={commonStyles.row}>
                <input
                    className={commonStyles.textbox}
                    aria-label="Set player Alias"
                    value={alias}
                    onChange={e => setAlias(e.target.value)}
                />
            </div>
            <div className={commonStyles.row}>
                <select id="teamId" onChange={e => setTeamId(e.target.value)} value={teamId}>
                    {teamOptions}
                </select>
            </div>
            <div className={commonStyles.row}>
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
