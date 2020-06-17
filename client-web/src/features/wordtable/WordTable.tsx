import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    playerSessionId,
    playerToken,
    sessionCells,
    sessionNumOfColumns,
    sessionTeams,
    turn
} from "../../app/gameStateSlice";
import styles from './WordTable.module.css';
import {Cell, Team} from "../../proto/tri_pb";
import {GameScore} from "../game-score/GameScore";
import {JoinLink} from "../link-join/JoinLink";

export function WordTable() {
    const sessionId = useSelector(playerSessionId);
    const token = useSelector(playerToken);

    const numOfColumns = Math.max(1, useSelector(sessionNumOfColumns));
    const words = useSelector(sessionCells);
    const teams = useSelector(sessionTeams);
    const dispatch = useDispatch();

    const teamIdx = teams.reduce<Map<string, number>>((map: Map<string, number>, currentValue: Team.AsObject, currentIndex: number) => {
        map.set(currentValue.id, currentIndex);
        return map;
    }, new Map());

    function turnWord(position: number) {
        if (sessionId && token) {
            dispatch(turn(token, sessionId, position));
        }
    }

    const rows = [];
    for (let i = 0; i < words.length; i += numOfColumns) {
        const cols = words.slice(i, i + numOfColumns).map((w, index) => {
                    let kindStyle = "";
                    if (w.type === Cell.Type.END_GAME) {
                        kindStyle =  styles["kind_end"];
                    } else if (w.type === Cell.Type.TEAM_OWNED) {
                        kindStyle = styles["kind_owned_" + teamIdx.get(w.ownerteamid)];
                    } else {
                        kindStyle =  styles["kind_regular"];
                    }

                    let openStyle = w.open ? styles.open : ""

                return <td key={i + index} onClick={() => turnWord(i + index)}>
                    <div
                        className={[styles.word_cell,kindStyle,openStyle].join(' ')}>
                        <span>{w.word}</span>
                    </div>
                </td>
            }
        );
        rows.push(cols)
    }
    const scoreColSpan = Math.floor(numOfColumns / 2);

    return <table onTouchStart={() => console.log()} className={styles.world_table}>
        <tbody>
        <tr>
            <td colSpan={scoreColSpan}><GameScore/></td>
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
