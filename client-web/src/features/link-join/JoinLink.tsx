import React from "react";
import styles from './JoinLink.module.css';
import {gameSessionUrl} from "../../app/config";
import {useSelector} from "react-redux";
import {playerSessionId} from "../../app/gameStateSlice";

export function JoinLink() {
    const sessionId = useSelector(playerSessionId)
    const link = gameSessionUrl(sessionId!);

    function copyMessage(val: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    return <div>
        <label className={styles.tooltip} onClick={() => copyMessage(link)}>
            Share session #{sessionId}
            <input type="checkbox"/>
            <span>Link copied!</span>
        </label>
    </div>
}
