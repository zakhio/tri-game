import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {playerToken, sessionMe, setSettings,} from '../../app/gameStateSlice';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core";

const messages = defineMessages({
    playerName: {
        id: 'popup.missingName.field',
        defaultMessage: 'Your name',
        description: 'Field for player name input on missing player name popup',
    },
});

export function PlayerName({sessionId}: { sessionId: string }) {
    const intl = useIntl();

    const token = useSelector(playerToken);
    const me = useSelector(sessionMe);
    const dispatch = useDispatch();

    const [playerName, setPlayerName] = useState(me!.alias);
    const [open, setOpen] = useState(!(me!.alias));

    function savePlayerName() {
        dispatch(setSettings(token, sessionId!, playerName));
        setOpen(false);
    }

    function skipPlayerName() {
        setOpen(false);
    }

    return (
        <Dialog open={open} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                <FormattedMessage id="popup.missingName.title"
                                  defaultMessage="Player name"
                                  description="Title on updating name"/>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <FormattedMessage id="popup.missingName.text"
                                      defaultMessage="Enter your name so other players know who you are:"
                                      description="Text on updating name"/>
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label={intl.formatMessage(messages.playerName)}
                    fullWidth
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => skipPlayerName()}>
                    <FormattedMessage id="popup.missingName.cancelButton"
                                      defaultMessage="Skip"
                                      description="Button to skip entering name"/>
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => savePlayerName()}>
                    <FormattedMessage id="popup.missingName.saveButton"
                                      defaultMessage="Save"
                                      description="Button to save player name"/>
                </Button>
            </DialogActions>
        </Dialog>
    );
}
