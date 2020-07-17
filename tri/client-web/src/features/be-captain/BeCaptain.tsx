import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {playerToken, sessionMe, sessionStarted, setSettings,} from '../../app/gameStateSlice';
import {FormattedMessage} from 'react-intl';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import {Settings} from "@material-ui/icons";

export function BeCaptain({sessionId}: { sessionId: string }) {
    const token = useSelector(playerToken);
    const me = useSelector(sessionMe)!;
    const started = useSelector(sessionStarted);
    const dispatch = useDispatch();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Dialog fullScreen={fullScreen} open={started && me.captain === undefined} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                <FormattedMessage id="popup.startRound.title"
                                  defaultMessage="Start of the new round"
                                  description="Title on start new round popup"/>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <FormattedMessage id="popup.startRound.description"
                                      defaultMessage="Welcome to the new round! Decide who is in your team and if who is the captain."
                                      description="Description on start new round popup"/>
                </DialogContentText>
                <DialogContentText>
                    <FormattedMessage id="popup.startRound.actionText"
                                      defaultMessage="Press a button corresponding your role to start playing. Good luck!"
                                      description="Call to action on start new round popup"/>
                </DialogContentText>
                <DialogContentText variant="body2">
                    <FormattedMessage id="popup.startRound.settings"
                                      defaultMessage="You can change your choice by clicking button "
                                      description="Text on start new round popup"/>
                    <Settings fontSize="small"/>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    onClick={() => dispatch(setSettings(token, sessionId!, undefined, true))}>
                    <FormattedMessage id="popup.startRound.captainButton"
                                      defaultMessage="Play as Captain"
                                      description="Button to plays as captain"/>
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => dispatch(setSettings(token, sessionId!, undefined, false))}>
                    <FormattedMessage id="popup.startRound.regularButton"
                                      defaultMessage="Play as Regular"
                                      description="Button to play as regular player"/>
                </Button>
            </DialogActions>
        </Dialog>
    );
}
