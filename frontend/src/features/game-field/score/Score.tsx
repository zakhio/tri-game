import React from 'react';
import fieldStyles from '../GameField.module.css';
import { useSelector } from 'react-redux';
import { gameCells, gameTeamCount } from '../../../app/gameStateSlice';
import Typography from '@mui/material/Typography';

export function Score() {
    const teamCount = useSelector(gameTeamCount);
    const cells = useSelector(gameCells)

    const r: JSX.Element[] = [];
    for (let i: number = 0; i < teamCount; i++) {
        const teamStyle = fieldStyles["score_owned_" + i];
        r.push(<span key={2 * i}
            className={teamStyle}>
            {cells.filter((v) => v.type === 'TEAM_OWNED' && v.ownerTeamId === i && v.open).length}
        </span>);

        if (i !== teamCount - 1) {
            r.push(<span key={2 * i + 1}>–</span>);
        }
    }

    return <Typography variant="h3" align="center">{r}</Typography>;
}
