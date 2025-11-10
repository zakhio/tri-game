import React from 'react';
import { useSelector } from 'react-redux';
import { startGame, } from '../../app/gameStateSlice';
import { useIntl } from 'react-intl';
import { Button, ButtonGroup, Grid, Typography } from "@mui/material";
import messages from "./GameIntro.messages";
import { useAppDispatch } from "../../app/store";

export function GameIntro({ sessionId }: { sessionId: string }) {
    const intl = useIntl();
    const dispatch = useAppDispatch();

    return (
        <Grid container spacing={3}>
            <Grid size={{xs: 12, sm: 2}}>
                <img src="logo.svg" alt="Game TRI logo" />
            </Grid>
            <Grid container direction="column" size={{xs: 12, sm:10}} wrap="nowrap">
                <Typography variant="body1" gutterBottom>
                    {intl.formatMessage(messages.p1)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {intl.formatMessage(messages.p2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {intl.formatMessage(messages.p3)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {intl.formatMessage(messages.selectLanguage)}
                </Typography>
            </Grid>
            <Grid size={12}>
                <Grid container justifyContent="center">
                    <ButtonGroup color="secondary" variant="contained" aria-label="outlined primary button group">
                        <Button
                            onClick={() => dispatch(startGame(sessionId!, 'en'))}>
                            {intl.formatMessage(messages.enButton)}
                        </Button>
                        <Button
                            onClick={() => dispatch(startGame(sessionId!, 'ru'))}>
                            {intl.formatMessage(messages.ruButton)}
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </Grid>
    );
}
