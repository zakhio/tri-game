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
import styles from './WordTable.module.css';
import {Team} from "../../proto/tri_pb";
import {GameScore} from "../game-score/GameScore";
import {JoinLink} from "../link-join/JoinLink";
import {WordCell} from "./WordCell";

export function WordTable() {
    const sessionId = useSelector(playerSessionId);
    const token = useSelector(playerToken);

    const numOfColumns = Math.max(1, useSelector(sessionNumOfColumns));
    const cells = useSelector(sessionCells);
    const teams = useSelector(sessionTeams);
    const me = useSelector(sessionMe);
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
    for (let i = 0; i < cells.length; i += numOfColumns) {
        const cols = cells.slice(i, i + numOfColumns).map((c, index) => {
                return <td key={i + index}>
                    <WordCell cell={c} teamIdx={teamIdx} onClick={() => turnWord(i + index)}/>
                    {/*<WordCell2 cell={c} onClick={() => turnWord(i + index)} showColor={me!.captain}/>*/}
                </td>
            }
        );
        rows.push(cols)
    }
    const scoreColSpan = Math.floor(numOfColumns / 2);

    return <table id="Gamefield" onTouchStart={() => console.log()} className={styles.world_table}>
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
