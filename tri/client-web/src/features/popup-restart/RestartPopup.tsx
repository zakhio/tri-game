import React from 'react';
import {useIntl} from 'react-intl';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import messages from "./RestartPopup.messages";

export function RestartPopup({open, onAgree, onDisagree}: { open: boolean, onAgree: () => void, onDisagree: () => void }) {
    const intl = useIntl();

    return (
        <Dialog open={open} aria-labelledby="restart-dialog-title">
            <DialogTitle id="restart-dialog-title">
                {intl.formatMessage(messages.title)}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {intl.formatMessage(messages.text)}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    onClick={() => onAgree()}>
                    {intl.formatMessage(messages.agree)}
                </Button>
                <Button
                    color="secondary"
                    onClick={() => onDisagree()}>
                    {intl.formatMessage(messages.disagree)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
