import React from "react";
import {gameSessionUrl} from "../../app/config";
import {TelegramIcon, TelegramShareButton} from "react-share";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useParams} from "react-router-dom";
import {Grid, Typography} from "@material-ui/core";

const messages = defineMessages({
    provider_title: {
        id: 'feature.invite.provider.title',
        defaultMessage: 'TRI Game',
        description: 'Title for share window in provider window',
    },
});

export function SessionShare() {
    const {sessionId} = useParams();

    const intl = useIntl();
    const link = gameSessionUrl(sessionId!);

    return <Grid container justify="center" alignItems="center">
        <Grid item>
            <Typography variant="body2">
                <FormattedMessage id="feature.invite.text"
                                  defaultMessage="Invite friends to current session:"
                                  description="Text for inviting friend for the game session"
                                  values={{sessionId}}/>
            </Typography>
        </Grid>
        <Grid item>
            <TelegramShareButton
                url={link}
                title={intl.formatMessage(messages.provider_title)}>
                <TelegramIcon size={22} round/>
            </TelegramShareButton>
        </Grid>
    </Grid>
}
