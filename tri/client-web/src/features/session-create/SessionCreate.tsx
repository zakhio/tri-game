import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from "react-router-dom";
import {createSession, playerToken,} from '../../app/gameStateSlice';
import {useIntl} from 'react-intl';
import {Button, Grid, Typography} from "@material-ui/core";
import messages from "./SessionCreate.messages";

export function SessionCreate() {
    const intl = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const token = useSelector(playerToken);

    return (
        <Grid container direction="column" alignItems="center" spacing={3}>
            <Grid item xs={12}>
                <img src="logo.svg" alt="Game TRI logo"/>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4" align="center">
                    {intl.formatMessage(messages.title)}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => dispatch(createSession(token, history))}>
                    {intl.formatMessage(messages.button)}
                </Button>
            </Grid>
        </Grid>
    );
}
