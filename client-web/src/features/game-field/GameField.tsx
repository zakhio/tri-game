import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    playerSessionId,
    playerToken,
    sessionCells,
    sessionMe,
    sessionNumOfColumns,
    sessionTeams,
    turn
} from "../../app/gameStateSlice";
import styles from './GameField.module.css';
import {Team} from "../../proto/tri_pb";
import {Score} from "./score/Score";
import {JoinLink} from "../link-join/JoinLink";
import {FieldCell} from "./cell/FieldCell";
import {FieldCell2} from "./cell/FieldCell2";

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
                    {/*<FieldCell cell={c} teamIdx={teamIdx} onClick={() => turnWord(i + index)}/>*/}
                    <FieldCell2 cell={c} onClick={() => turnWord(i + index)} showColor={me!.captain}/>
                </td>
            }
        );
        rows.push(cols)
    }
    const scoreColSpan = Math.floor(numOfColumns / 2);

    return <table className={styles.world_table}>
        <tbody>
        <tr>
            <td colSpan={scoreColSpan}><Score/></td>
            <td colSpan={numOfColumns - scoreColSpan}><JoinLink/></td>
        </tr>
        {rows.map((r, index) =>
            <tr key={index}>
                {r}
            </tr>
        )}
        </tbody>
    </table>
}
