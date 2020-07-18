import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {playerToken, tryJoinAsync,} from '../../app/gameStateSlice';
import {useIntl} from 'react-intl';
import {useHistory} from "react-router-dom";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import messages from "./SessionJoin.messages";

export function SessionJoin({sessionId}: { sessionId?: string }) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const token = useSelector(playerToken)

    const [_sessionId, _setSessionId] = useState(sessionId || "");
    const [playerName, setPlayerName] = useState("");

    return (
        <form autoComplete="off">
            <Grid container direction="column" alignItems="center" spacing={3}>
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
                    <TextField required
                               fullWidth
                               id="standard-required"
                               label={intl.formatMessage(messages.playerName)}
                               value={playerName}
                               onChange={e => setPlayerName(e.target.value)}/>
                </Grid>
                <Grid item xs>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            dispatch(tryJoinAsync(token, _sessionId, playerName, history));
                        }}>
                        {intl.formatMessage(messages.button)}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
