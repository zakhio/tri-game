import React, {useCallback} from "react";
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

    const turnWord = useCallback((cellIndex: number) => {
      if (inProgress) {
        dispatch(makeTurn(sessionId, cellIndex));
      }
    }, [dispatch, sessionId, inProgress])

    const showColor = playerCaptain ?? !inProgress;

    const rows = [];
    for (let i = 0; i < cells.length; i += columnCount) {
        const cols = cells.slice(i, i + columnCount).map((c, index) => {
            return <Grid size="grow" key={cells.length + (i + index)}>
                <FieldCell cell={c} onClick={() => turnWord(i + index)} showColor={showColor} />
            </Grid>
        }
        );
        rows.push(cols)
    }

    return <Grid container direction="column" spacing={1}>
        <Grid container size={12}>
            <FieldHeader sessionId={sessionId} onSettingsClick={onSettingsClick} />
        </Grid>
        <Grid container size={12} spacing={1}>
            {rows.map((row, index) =>
                <Grid container size={12} spacing={1} key={index}>
                    {row}
                </Grid>
            )}
        </Grid>
    </Grid>
}
