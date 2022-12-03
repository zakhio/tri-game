import React from 'react';
import fieldStyles from '../GameField.module.css';
import {useSelector} from 'react-redux';
import {gameTeams,} from '../../../app/gameStateSlice';
import Typography from '@mui/material/Typography';

export function Score() {
    const teams = useSelector(gameTeams);

    const r: JSX.Element[] = [];
    teams.forEach((t, i) => {
        const teamStyle = fieldStyles["score_owned_" + t.id];
        r.push(<span key={2 * i}
                     className={teamStyle}>
            {t.remainingcount}
        </span>);

        if (i !== teams.length - 1) {
            r.push(<span key={2 * i + 1}>–</span>);
        }
    });

    return <Typography variant="h3" align="center">{r}</Typography>;
}