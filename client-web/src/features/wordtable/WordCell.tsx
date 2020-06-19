import React from "react";
import styles from './WordTable.module.css';
import {Cell} from "../../proto/tri_pb";

export function WordCell({cell, teamIdx, onClick}: { cell: Cell.AsObject, teamIdx: Map<string, number>, onClick:Function }) {
    let kindStyle;

    if (cell.type === Cell.Type.END_GAME) {
        kindStyle = styles["kind_end"];
    } else if (cell.type === Cell.Type.TEAM_OWNED) {
        kindStyle = styles["kind_owned_" + teamIdx.get(cell.ownerteamid)];
    } else {
        kindStyle = styles["kind_regular"];
    }

    let openStyle = cell.open ? styles.open : ""

    return <div onClick={() => onClick()}
        className={[styles.word_cell, kindStyle, openStyle].join(' ')}>
        <span>{cell.word}</span>
    </div>

}
