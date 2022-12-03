import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {gameCells, gameMe, gameNumOfColumns, gameStarted, playerToken, turn} from "../../app/gameStateSlice";
import {FieldCell} from "./cell/FieldCell";
import {Grid} from '@material-ui/core';
import {FieldHeader} from "./header/FieldHeader";

export function GameField({onSettingsClick, sessionId}: { onSettingsClick: Function, sessionId: string }) {
    const dispatch = useDispatch();

    const token = useSelector(playerToken);
    const cells = useSelector(gameCells);
    const started = useSelector(gameStarted);
    const me = useSelector(gameMe);
    const numOfColumns = Math.max(1, useSelector(gameNumOfColumns));

    function turnWord(position: number) {
        if (sessionId && token) {
            dispatch(turn(token, sessionId, position));
        }
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += numOfColumns) {
        const cols = cells.slice(i, i + numOfColumns).map((c, index) => {
                const showColor = !started || (me!.initialized && me!.captain);
                return <Grid item xs key={i + index}>
                    <FieldCell cell={c} onClick={() => turnWord(i + index)} showColor={showColor}/>
                </Grid>
            }
        );
        rows.push(cols)
    }

    return <Grid container direction="column" spacing={1}>
        <Grid container item xs={12}>
            <FieldHeader sessionId={sessionId} onSettingsClick={onSettingsClick}/>
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
