import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {playerToken, sessionCells, sessionMe, sessionNumOfColumns, turn} from "../../app/gameStateSlice";
import styles from './GameField.module.css';
import {Score} from "./score/Score";
import {SessionShare} from "../session-share/SessionShare";
import {FieldCell} from "./cell/FieldCell";
import {useParams} from "react-router-dom";
import {Grid} from '@material-ui/core';
import {Settings} from '@material-ui/icons';

export function GameField({onSettings}: { onSettings: Function }) {
    const {sessionId} = useParams();

    const token = useSelector(playerToken);

    const numOfColumns = Math.max(1, useSelector(sessionNumOfColumns));
    const cells = useSelector(sessionCells);
    const me = useSelector(sessionMe);
    const dispatch = useDispatch();

    function turnWord(position: number) {
        if (sessionId && token) {
            dispatch(turn(token, sessionId, position));
        }
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += numOfColumns) {
        const cols = cells.slice(i, i + numOfColumns).map((c, index) => {
                return <Grid item xs key={i + index}>
                    <FieldCell cell={c} onClick={() => turnWord(i + index)} showColor={me!.captain}/>
                </Grid>
            }
        );
        rows.push(cols)
    }

    return <div className={styles.world_table}>
        <Grid container spacing={1} justify="center">
            <Score/>
            <Settings onClick={() => onSettings()}/>
        </Grid>
        <Grid container spacing={1}>
            {rows.map((r, index) =>
                <Grid container item xs={12} spacing={1} key={index}>
                    {r}
                </Grid>
            )}
        </Grid>
        <Grid container spacing={1}>
            <SessionShare/>
        </Grid>
    </div>
}
