import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {playerToken, startGame,} from '../../app/gameStateSlice';
import {useIntl} from 'react-intl';
import {Button, Grid, Typography} from "@material-ui/core";
import messages from "./GameIntro.messages";

export function GameIntro({sessionId}: { sessionId: string }) {
    const intl = useIntl();
    const dispatch = useDispatch();

    const token = useSelector(playerToken);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
                <img src="icon.svg" alt="Game TRI logo"/>
            </Grid>
            <Grid item xs={12} sm={10} wrap="nowrap">
                <Typography variant="body1" gutterBottom>
                    {intl.formatMessage(messages.p1)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {intl.formatMessage(messages.p2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {intl.formatMessage(messages.p3)}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container justify="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => dispatch(startGame(token!, sessionId!))}>
                        {intl.formatMessage(messages.button)}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}
