import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    playerSessionId,
    playerToken,
    sessionCells,
    sessionMe,
    sessionNumOfColumns,
    turn
} from "../../app/gameStateSlice";
import styles from './GameField.module.css';
import {Score} from "./score/Score";
import {SessionShare} from "../session-share/SessionShare";
import {FieldCell} from "./cell/FieldCell";

export function GameField() {
    const sessionId = useSelector(playerSessionId);
    const token = useSelector(playerToken);

    const numOfColumns = Math.max(1, useSelector(sessionNumOfColumns));
    const cells = useSelector(sessionCells);
    const me = useSelector(sessionMe);
    const dispatch = useDispatch();

    function turnWord(position: number) {
        if (sessionId && token) {
            dispatch(turn(token, sessionId, position));
        }
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += numOfColumns) {
        const cols = cells.slice(i, i + numOfColumns).map((c, index) => {
                return <td key={i + index}>
                    <FieldCell cell={c} onClick={() => turnWord(i + index)} showColor={me!.captain}/>
                </td>
            }
        );
        rows.push(cols)
    }

    return <table className={styles.world_table}>
        <tbody>
        <tr>
            <td colSpan={numOfColumns}><Score/></td>
        </tr>
        {rows.map((r, index) =>
            <tr key={index}>
                {r}
            </tr>
        )}
        <tr>
            <td colSpan={numOfColumns}><SessionShare/></td>
        </tr>
        </tbody>
    </table>
}
