import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    playerToken,
    sessionCells,
    sessionMe,
    sessionNumOfColumns,
    sessionStarted,
    setSettings,
    startGame,
    turn
} from "../../app/gameStateSlice";
import {SessionShare} from "../session-share/SessionShare";
import {FieldCell} from "./cell/FieldCell";
import {Button, Grid} from '@material-ui/core';
import {FormattedMessage} from "react-intl";
import {FieldHeader} from "./header/FieldHeader";

export function GameField({onSettings, sessionId}: { onSettings: Function, sessionId: string }) {
    const token = useSelector(playerToken);

    const numOfColumns = Math.max(1, useSelector(sessionNumOfColumns));
    const cells = useSelector(sessionCells);
    const started = useSelector(sessionStarted);
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
                    <FieldCell cell={c} onClick={() => turnWord(i + index)} showColor={!started || me!.captain}/>
                </Grid>
            }
        );
        rows.push(cols)
    }

    return <Grid container direction="column" spacing={1} style={{paddingTop: "10px"}}>
        <Grid item xs={12}>
            <FieldHeader sessionId={sessionId}/>
        </Grid>
        <Grid container item xs={12} spacing={1}>
            {rows.map((r, index) =>
                <Grid container item xs={12} spacing={1} key={index}>
                    {r}
                </Grid>
            )}
        </Grid>
        <Grid item xs={12}>
            <SessionShare/>
        </Grid>
        <Grid container item xs={12} justify="center">
            <Button
                variant="text"
                color="secondary"
                onClick={() => dispatch(startGame(token!, sessionId!))}>
                <FormattedMessage id="page.game.restart"
                                  defaultMessage="Restart"
                                  description="Button on restart game session page"/>
            </Button>
            <Button
                variant={me!.captain ? "outlined" : "text"}
                color="primary"
                onClick={() => dispatch(setSettings(token!, sessionId!, undefined, !(me!.captain)))}>
                <FormattedMessage id="page.game.becameCaptain"
                                  defaultMessage="Play as captain"
                                  description="Button on play as a captain"/>
            </Button>
        </Grid>
    </Grid>
}
