import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    playerSessionId,
    playerToken,
    sessionMe,
    sessionNumOfColumns,
    sessionPlayers,
    sessionWords,
    turn
} from "../../app/gameStateSlice";
import styles from './WordTable.module.css';

export function WordTable() {
    const sessionId = useSelector(playerSessionId);
    const token = useSelector(playerToken);

    const numOfColumns = Math.max(1, useSelector(sessionNumOfColumns));
    const words = useSelector(sessionWords);
    const players = useSelector(sessionPlayers);
    const me = useSelector(sessionMe);
    const dispatch = useDispatch();

    function turnWord(position: number) {
        if (sessionId && token) {
            dispatch(turn(sessionId, token, position));
        }
    }

    const rows = [];
    for (let i = 0; i < words.length; i += numOfColumns) {
        const cols = words.slice(i, i + numOfColumns).map((w, index) =>
            <td key={i + index} onClick={() => turnWord(i + index)}>
                <div className={styles.word_cell + " " + (w.open ? styles.open + " " + styles["open_kind_" + w.skinid] : "")}>
                    <span>{w.word}</span>
                </div>
            </td>
        );
        rows.push(cols)
    }

    return <table onTouchStart={() => console.log()} className={styles.world_table}>
        {rows.map((r, index) =>
            <tr key={index}>
                {r}
            </tr>
        )}
    </table>
}
