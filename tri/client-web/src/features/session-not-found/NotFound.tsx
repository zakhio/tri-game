import React from 'react';
import {useIntl} from 'react-intl';
import {Button, Grid, Typography} from "@material-ui/core";
import messages from "./NotFound.messages";
import {useHistory} from "react-router-dom";

export function NotFound({sessionId}: { sessionId: string }) {
    const intl = useIntl();
    const history = useHistory();

    function goHome() {
        history.push("/");
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
                <img src="logo.svg" alt="Game TRI logo"/>
            </Grid>
            <Grid container direction="column" item xs={12} sm={10} wrap="nowrap">
                <Typography variant="body1" gutterBottom>
                    {intl.formatMessage(messages.text, {sessionId})}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container justify="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => goHome()}>
                        {intl.formatMessage(messages.button)}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}
