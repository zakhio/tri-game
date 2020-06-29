import React, {useState} from 'react';
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {playerToken, tryJoinAsync,} from '../../app/gameStateSlice';
import {FormattedMessage} from 'react-intl';
import {useHistory} from "react-router-dom";
import {Grid, Typography, Button, TextField} from "@material-ui/core";

export function SessionJoin({sessionId}: { sessionId?: string }) {
    const history = useHistory();

    const token = useSelector(playerToken)
    const dispatch = useDispatch();

    const [_sessionId, _setSessionId] = useState(sessionId || "");
    const [playerName, setPlayerName] = useState("");

    return (
        <div>
            <form autoComplete="off">
                <Grid container direction="column" justify="center" alignItems="center" spacing={3}>
                    <Grid item xs>
                        <Typography variant="h4">
                            <FormattedMessage id="page.join.title"
                                              defaultMessage="Join to session"
                                              description="Welcome title on join game session page"/>
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <TextField required
                                   id="standard-required"
                                   label="Session ID"
                                   value={sessionId}
                                   onChange={e => _setSessionId(e.target.value)}/>
                    </Grid>
                    <Grid item xs>
                        <TextField required
                                   id="standard-required"
                                   label="Player Name"
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
        </div>
    );
}
