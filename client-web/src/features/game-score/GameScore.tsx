import React from 'react';
import styles from './GameScore.module.css';
import {useSelector} from 'react-redux';
import {sessionTeams,} from '../../app/gameStateSlice';

export function GameScore() {
    const teams = useSelector(sessionTeams)
    const r:JSX.Element[] = [];
    teams.forEach((t, i) => {
        r.push(<span key={2 * i} className={styles.gameScore}>{t.remainingcount}</span>);
        if (i !== teams.length - 1) {
            r.push(<span key={2 * i + 1}>:</span>);
        }
    });

    return <div>{r}</div>;
}
