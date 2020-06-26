import React from 'react';
import styles from './Score.module.css';
import fieldStyles from '../GameField.module.css';
import {useSelector} from 'react-redux';
import {sessionTeams,} from '../../../app/gameStateSlice';

export function Score() {
    const teams = useSelector(sessionTeams)
    const r:JSX.Element[] = [];
    teams.forEach((t, i) => {
        const teamStyle = fieldStyles["kind_owned_" + t.id];
        r.push(<span key={2 * i}
                     className={styles.gameScore + " " + teamStyle}>
            {t.remainingcount}
        </span>);

        if (i !== teams.length - 1) {
            r.push(<span key={2 * i + 1}>:</span>);
        }
    });

    return <div>{r}</div>;
}
