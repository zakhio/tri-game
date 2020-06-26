import React, {useRef} from "react";
import {Cell} from "../../../proto/tri_pb";
import styles from './FieldCell.module.css';
import fieldStyles from '../GameField.module.css';
import {animated, useSpring} from "react-spring";

function calcVal(open: boolean, hover: boolean = false): number {
    if (hover && !open) {
        return 1;
    } else {
        return open ? 2 : 0;
    }
}

const trans = (val: number) => {
    let rot = val * 80 + Math.max(0, val - 1) * 20;
    return `rotateX(${rot}deg`
}


export function FieldCell2({cell, onClick, showColor}: { cell: Cell.AsObject, onClick: Function, showColor: boolean }) {
    const prevVal = useRef(calcVal(cell.open));
    const [{val}, setVal] = useSpring(() => ({val: prevVal.current}));

    console.log(cell, onClick, showColor)

    function onHover(flag: boolean) {
        const v = calcVal(cell.open, flag);
        prevVal.current = v;
        setVal({val: v});
    }

    setVal({val: calcVal(cell.open)})

    let kind_style;

    switch (cell.type) {
        case Cell.Type.TEAM_OWNED:
            kind_style = fieldStyles["kind_owned_" + cell.ownerteamid];
            break
        case Cell.Type.END_GAME:
            kind_style = fieldStyles.kind_end;
            break;
        case Cell.Type.REGULAR:
        default:
            kind_style = fieldStyles.kind_regular;
            break;
    }

    const kind_front_style = showColor ? kind_style : fieldStyles.kind_closed;

    return <div
        onClick={(event) => {
            event.preventDefault()
            onClick();
        }}

        onMouseOver={(event) => {
            onHover(true);
        }}

        onMouseOut={(event) => {
            onHover(false);
        }}

        onTouchStart={(event) => {
            onHover(true);
        }}
        onTouchEnd={(event) => {
            event.preventDefault()
            onHover(false)
            onClick();
        }}
        onTouchMove={(event) => {
            let myLocation = event.changedTouches[0];
            let rect = event.currentTarget.getBoundingClientRect();
            if (rect.left <= myLocation.clientX && myLocation.clientX <= rect.right
                && rect.top <= myLocation.clientY && myLocation.clientY <= rect.bottom) {
                onHover(true);
            } else {
                onHover(false)
            }
        }}

        className={styles.cell_container}>
        <animated.div
            className={styles.cell}
            style={{transform: val.to(trans)}}>
            <animated.div
                className={[
                    styles.cell_face,
                    styles.face_front,
                    kind_front_style].join(" ")}>
                {cell.word}
            </animated.div>
            <animated.div
                className={[
                    styles.cell_face,
                    styles.face_back,
                    kind_style].join(" ")}>
                {cell.word}
            </animated.div>
        </animated.div>
    </div>
}
