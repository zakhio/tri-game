import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {playerToken, tryJoinAsync,} from '../../app/gameStateSlice';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {useHistory} from "react-router-dom";
import {Button, Grid, TextField, Typography} from "@material-ui/core";

const messages = defineMessages({
    sessionId: {
        id: 'page.join.sessionId',
        defaultMessage: 'Session ID',
        description: 'Title for session id input on join session page',
    },
    playerName: {
        id: 'page.join.playerName',
        defaultMessage: 'Player Name',
        description: 'Title for player name input on join session page',
    },
});

export function SessionJoin({sessionId}: { sessionId?: string }) {
    const history = useHistory();

    const intl = useIntl();

    const token = useSelector(playerToken)
    const dispatch = useDispatch();

    const [_sessionId, _setSessionId] = useState(sessionId || "");
    const [playerName, setPlayerName] = useState("");

    return (
        <form autoComplete="off">
            <Grid container direction="column" alignItems="center" spacing={3}>
                <Grid item xs>
                    <Typography variant="h4" align="center">
                        <FormattedMessage id="page.join.title"
                                          defaultMessage="Join to session"
                                          description="Welcome title on join game session page"/>
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
                        color="primary"
                        onClick={() => {
                            dispatch(tryJoinAsync(token, _sessionId, playerName, history));
                        }}>
                        <FormattedMessage id="page.join.button"
                                          defaultMessage="Join"
                                          description="Button on join game session page"/>
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}
