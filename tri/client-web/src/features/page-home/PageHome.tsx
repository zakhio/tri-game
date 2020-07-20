import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createSession, playerToken, tryJoinAsync,} from '../../app/gameStateSlice';
import {useIntl} from 'react-intl';
import {useHistory} from "react-router-dom";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import messages from "./PageHome.messages";

export function PageHome({sessionId}: { sessionId?: string }) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const token = useSelector(playerToken)

    const [_sessionId, _setSessionId] = useState(sessionId || "");

    return (
        <form autoComplete="off">
            <Grid container direction="column" alignItems="center" spacing={3}>
                <Grid item xs={12}>
                    <img src="logo.svg" alt="Game TRI logo"/>
                </Grid>
                <Grid item xs>
                    <Typography variant="h4" align="center">
                        {intl.formatMessage(messages.title)}
                    </Typography>
                </Grid>
                <Grid item xs>
                    <TextField required
                               autoFocus
                               fullWidth
                               id="standard-required"
                               label={intl.formatMessage(messages.sessionId)}
                               value={sessionId}
                               onChange={e => _setSessionId(e.target.value)}/>
                </Grid>
                <Grid item xs>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            dispatch(tryJoinAsync(token, _sessionId, history));
                        }}>
                        {intl.formatMessage(messages.join)}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => dispatch(createSession(token, history))}>
                        {intl.formatMessage(messages.create)}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
