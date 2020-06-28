import React from "react";
import {gameSessionUrl} from "../../app/config";
import {useSelector} from "react-redux";
import {playerSessionId} from "../../app/gameStateSlice";
import {TelegramIcon, TelegramShareButton} from "react-share";
import {FormattedMessage, useIntl} from "react-intl";

export function SessionShare() {
    const intl = useIntl();
    const sessionId = useSelector(playerSessionId)
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
            title={intl.formatMessage({
                id: 'feature.invite.provider.title',
                defaultMessage: 'TRI Game',
                description: 'Title for share window in provider window'})}>
            <TelegramIcon size={32} round/>
        </TelegramShareButton>
    </div>
}
