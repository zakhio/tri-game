import React from "react";
import {gameSessionUrl} from "../../app/config";
import {TelegramIcon, TelegramShareButton} from "react-share";
import {FormattedMessage, useIntl, defineMessages} from "react-intl";
import {useParams} from "react-router-dom";

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

    return <div>
        <span>
            <FormattedMessage id="feature.invite.text"
                              defaultMessage="Invite friends"
                              description="Text for inviting friend for the game session"
                              values={{sessionId}}/>
        </span>
        <TelegramShareButton
            url={link}
            title={intl.formatMessage(messages.provider_title)}>
            <TelegramIcon size={32} round/>
        </TelegramShareButton>
    </div>
}
