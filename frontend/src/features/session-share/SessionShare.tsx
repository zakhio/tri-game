import React from "react";
import { gameSessionUrl } from "../../app/config";
import { TelegramIcon, TelegramShareButton } from "react-share";
import { useIntl } from 'react-intl';
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import messages from "./SessionShare.messages";

export function SessionShare() {
    const intl = useIntl();
    const { sessionId } = useParams();

    const link = gameSessionUrl(sessionId!);

    return <Grid container justifyContent="center" alignItems="center">
        <Grid item>
            <Typography variant="body2">
                {intl.formatMessage(messages.invite)}
            </Typography>
        </Grid>
        <Grid item>
            <TelegramShareButton
                url={link}
                title={intl.formatMessage(messages.inviteMessage)}>
                <TelegramIcon size={22} round />
            </TelegramShareButton>
        </Grid>
    </Grid>
}
