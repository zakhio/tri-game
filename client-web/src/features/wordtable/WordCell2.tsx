import React, {useRef} from "react";
import {Cell} from "../../proto/tri_pb";
import styles from './WordTable.module.css';
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


export function WordCell2({cell, onClick, showColor}: { cell: Cell.AsObject, onClick: Function, showColor: boolean }) {
    const prevVal = useRef(calcVal(cell.open));
    const [{val}, setVal] = useSpring(() => ({val: prevVal.current}));

    function onHover(flag: boolean) {
        const v = calcVal(cell.open, flag);
        prevVal.current = v;
        setVal({val: v});
    }

    setVal({val: calcVal(cell.open)})

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
            <animated.div className={[styles.cell_face, styles.face_front].join(" ")}>{cell.word}</animated.div>
            <animated.div className={[styles.cell_face, styles.face_back, styles.kind_owned_0].join(" ")}>{cell.word}</animated.div>
        </animated.div>
    </div>

}
