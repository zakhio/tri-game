import React from 'react';
import { useSelector } from 'react-redux';
import { gameMe, gameInProgress, isPlayerInGame, playerToken, setSettings, } from '../../app/gameStateSlice';
import { useIntl } from 'react-intl';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import messages from "./BeCaptain.messages";
import { useAppDispatch } from "../../app/store";

export function BeCaptain({ sessionId }: { sessionId: string }) {
    const intl = useIntl();
    const dispatch = useAppDispatch();
    const theme = useTheme();

    const token = useSelector(playerToken);
    const inGame = useSelector(isPlayerInGame);
    const inProgress = useSelector(gameInProgress);

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog fullScreen={fullScreen} open={inProgress && !inGame} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                {intl.formatMessage(messages.title)}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {intl.formatMessage(messages.welcome)}
                </DialogContentText>
                <DialogContentText>
                    {intl.formatMessage(messages.callToAction)}
                </DialogContentText>
                <DialogContentText variant="body2">
                    {intl.formatMessage(messages.settingsInfo)}
                    <Settings fontSize="small" />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    onClick={() => dispatch(setSettings(token, sessionId!, true))}>
                    {intl.formatMessage(messages.captainRole)}
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => dispatch(setSettings(token, sessionId!, false))}>
                    {intl.formatMessage(messages.regularRole)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
