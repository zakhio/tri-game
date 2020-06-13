import React from "react";
import styles from './ClipboardText.module.css';

export function ClipboardText({link}: { link: string }) {
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

    return <label className={styles.tooltip} onClick={() => copyMessage(link)}>
        Copy Game link
        <input type="checkbox"/>
        <span>{link} copied!</span>
    </label>
}
