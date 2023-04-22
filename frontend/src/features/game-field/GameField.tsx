import React from "react";
import { useSelector } from "react-redux";
import {
    gameCells,
    gameConfig,
    isGameInProgress,
    isPlayerCaptain,
    makeTurn
} from "../../app/gameStateSlice";
import { FieldCell } from "./cell/FieldCell";
import { Grid } from '@mui/material';
import { FieldHeader } from "./header/FieldHeader";
import { useAppDispatch } from "../../app/store";

export function GameField({ onSettingsClick, sessionId }: { onSettingsClick: Function, sessionId: string }) {
    const dispatch = useAppDispatch();

    const cells = useSelector(gameCells);
    const config = useSelector(gameConfig);

    const inProgress = useSelector(isGameInProgress);
    const playerCaptain = useSelector(isPlayerCaptain);

    const columnCount = Math.max(1, config.columnCount);

    function turnWord(cellIndex: number) {
        dispatch(makeTurn(sessionId, cellIndex));
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += columnCount) {
        const cols = cells.slice(i, i + columnCount).map((c, index) => {
            const showColor = playerCaptain ?? !inProgress;
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
            {rows.map((row, index) =>
                <Grid container item xs={12} spacing={1} key={index}>
                    {row}
                </Grid>
            )}
        </Grid>
    </Grid>
}
