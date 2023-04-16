import React from "react";
import { useSelector } from "react-redux";
import {
    gameCells,
    gameMe,
    gameNumOfColumns,
    gameInProgress,
    isPlayerCaptain,
    playerToken,
    turn
} from "../../app/gameStateSlice";
import { FieldCell } from "./cell/FieldCell";
import { Grid } from '@mui/material';
import { FieldHeader } from "./header/FieldHeader";
import { useAppDispatch } from "../../app/store";

export function GameField({ onSettingsClick, sessionId }: { onSettingsClick: Function, sessionId: string }) {
    const dispatch = useAppDispatch();

    const token = useSelector(playerToken);
    const cells = useSelector(gameCells);
    const started = useSelector(gameInProgress);
    const captain = useSelector(isPlayerCaptain);
    const numOfColumns = Math.max(1, useSelector(gameNumOfColumns));

    function turnWord(cellIndex: number) {
        dispatch(turn(token, sessionId, cellIndex));
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += numOfColumns) {
        const cols = cells.slice(i, i + numOfColumns).map((c, index) => {
            const showColor = captain ?? !started;
            return <Grid item xs key={i + index}>
                <FieldCell cell={c} onClick={() => turnWord(i + index)} showColor={showColor} />
            </Grid>
        }
        );
        rows.push(cols)
    }

    return <Grid container direction="column" spacing={1}>
        <Grid container item xs={12}>
            <FieldHeader sessionId={sessionId} onSettingsClick={onSettingsClick} />
        </Grid>
        <Grid container item xs={12} spacing={1}>
            {rows.map((r, index) =>
                <Grid container item xs={12} spacing={1} key={index}>
                    {r}
                </Grid>
            )}
        </Grid>
    </Grid>
}
