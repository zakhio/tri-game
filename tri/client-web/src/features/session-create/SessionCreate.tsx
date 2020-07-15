import React from 'react';
// @ts-ignore
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from "react-router-dom";
import {createSession, playerToken,} from '../../app/gameStateSlice';
import {FormattedMessage} from "react-intl";
import {Button, Grid, Typography} from "@material-ui/core";

export function SessionCreate() {
    const history = useHistory();
    const token = useSelector(playerToken)
    const dispatch = useDispatch();

    return (
        <Grid container direction="column" alignItems="center" spacing={3}>
            <Grid item xs>
                <Typography variant="h4" align="center">
                    <FormattedMessage id="page.create.title"
                                      defaultMessage="Welcome to TRI game"
                                      description="Welcome title on create game session page"/>
                </Typography>
            </Grid>
            <Grid item xs>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => dispatch(createSession(token, history))}>
                    <FormattedMessage id="page.create.button"
                                      defaultMessage="Create Game Session"
                                      description="Button on create game session page"/>
                </Button>
            </Grid>
        </Grid>
    );
}
