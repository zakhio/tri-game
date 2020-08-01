import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createSession, joinAsync, playerToken,} from '../../app/gameStateSlice';
import {useIntl} from 'react-intl';
import {useHistory} from "react-router-dom";
import {Box, Button, Grid, TextField, Typography} from "@material-ui/core";
import messages from "./PageHome.messages";
import {LanguageSelector} from "../selector-language/LanguageSelector";

export function PageHome({setLocale}: { setLocale: (locale: string) => void }) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const token = useSelector(playerToken)

    const [sessionId, setSessionId] = useState("");

    return (
        <>
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
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => dispatch(createSession(token, history))}>
                            {intl.formatMessage(messages.create)}
                        </Button>
                    </Grid>
                    <Grid item xs>
                        <Typography align="center">
                            {intl.formatMessage(messages.or)}
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <TextField required
                                   autoFocus
                                   fullWidth
                                   id="standard-required"
                                   label={intl.formatMessage(messages.sessionId)}
                                   value={sessionId}
                                   onChange={e => setSessionId(e.target.value)}/>
                    </Grid>
                    <Grid item xs>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                dispatch(joinAsync(token, sessionId, history));
                            }}>
                            {intl.formatMessage(messages.join)}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Box position="absolute" top={10} right={10}>
                <LanguageSelector setUILocale={setLocale}/>
            </Box>
        </>
    );
}
