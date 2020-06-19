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

export function WordCell2({cell}: { cell: Cell.AsObject }) {
    const state = useRef(calcVal(cell.open));
    const [{val}, setVal] = useSpring(() => ({val: state.current}));

    function onHover(flag: boolean) {
        const v = calcVal(cell.open, flag);
        state.current = v;
        setVal({val: v});
    }

    setVal({val: calcVal(cell.open)})

    return <div onMouseEnter={() => onHover(true)}
                onMouseLeave={() => onHover(false)}>
        <animated.div
            // className={styles.word_cell}
            style={{transform: val.interpolate(v => `perspective(400px) rotateX(${80 * v}deg`)}}>
            <animated.span>{cell.word}</animated.span>
        </animated.div>
    </div>

}
