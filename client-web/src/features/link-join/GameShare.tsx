import React from "react";
import {gameSessionUrl} from "../../app/config";
import {useSelector} from "react-redux";
import {playerSessionId} from "../../app/gameStateSlice";
import {TelegramIcon, TelegramShareButton} from "react-share";

export function GameShare() {
    const sessionId = useSelector(playerSessionId)
    const link = gameSessionUrl(sessionId!);

    return <div>
        <div>Invite friends</div>
        <TelegramShareButton
            url={link}
            title="TRI Game">
            <TelegramIcon size={32} round/>
        </TelegramShareButton>
    </div>
}
