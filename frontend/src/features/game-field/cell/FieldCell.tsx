import React, { useRef } from "react";
import styles from './FieldCell.module.css';
import fieldStyles from '../GameField.module.css';
import Box from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from "@react-spring/web";
import { FieldCellDTO } from "../../../api/rest";

function calcVal(open?: boolean, hover: boolean = false): number {
    if (hover && open !== undefined && !open) {
        return 1;
    } else {
        return open ? 2 : 0;
    }
}

const trans = (val: number) => {
    let rot = val * 80 + Math.max(0, val - 1) * 20;
    return `rotateX(${rot}deg`
}

export function FieldCell({ cell, onClick, showColor }: { cell: FieldCellDTO, onClick: Function, showColor: boolean }) {
    const prevVal = useRef(calcVal(cell.open));
    const [{ val }, setVal] = useSpring(() => ({ val: prevVal.current }));

    function onHover(flag: boolean) {
        const v = calcVal(cell.open, flag);
        prevVal.current = v;
        setVal({ val: v });
    }

    setVal({ val: calcVal(cell.open) })

    let kind_style;

    switch (cell.type) {
        case "TEAM_OWNED":
            kind_style = fieldStyles["cell_owned_" + cell.ownerTeamId];
            break
        case "END_GAME":
            kind_style = fieldStyles.cell_end;
            break;
        case "REGULAR":
        default:
            kind_style = fieldStyles.cell_regular;
            break;
    }

    const kind_front_style = showColor ? kind_style : fieldStyles.cell_closed;
    const cell_overlay = showColor && cell.open ? styles.cell_overlay : "";

    return <Box
        onClick={(event) => {
            event.preventDefault()
            if (showColor) {
                return
            }
            if (prevVal.current === 1) {
                onClick();
            }
        }}

        onMouseOver={(event) => {
            if (showColor) {
                return
            }

            onHover(true);
        }}

        onMouseOut={(event) => {
            if (showColor) {
                return
            }
            onHover(false);
        }}

        onTouchStart={(event) => {
            if (showColor) {
                return
            }
            onHover(true);
        }}
        onTouchEnd={(event) => {
            event.preventDefault()
            if (showColor) {
                return
            }
            if (prevVal.current === 1) {
                onClick();
            }
        }}
        onTouchMove={(event) => {
            if (showColor) {
                return
            }

            let myLocation = event.changedTouches[0];
            let rect = event.currentTarget.getBoundingClientRect();
            if (rect.left <= myLocation.clientX && myLocation.clientX <= rect.right
                && rect.top <= myLocation.clientY && myLocation.clientY <= rect.bottom) {
                onHover(true);
            } else {
                onHover(false)
            }
        }}

        className={[
            styles.cell_container,
            cell_overlay].join(" ")}>
        <animated.div
            className={styles.cell}
            style={{ transform: val.to(trans) }}>
            <animated.div
                className={[
                    styles.cell_face,
                    styles.face_front,
                    kind_front_style].join(" ")}>
                <Typography variant="caption" align="center">
                    {cell.word}
                </Typography>
            </animated.div>
            <animated.div
                className={[
                    styles.cell_face,
                    styles.face_back,
                    kind_style].join(" ")}>
                <Typography variant="caption" align="center">
                    {cell.word}
                </Typography>
            </animated.div>
        </animated.div>
    </Box>
}
