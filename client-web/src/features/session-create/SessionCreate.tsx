import React from 'react';
// @ts-ignore
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {createSession, playerToken,} from '../../app/gameStateSlice';

export function SessionCreate() {
    const token = useSelector(playerToken)
    const dispatch = useDispatch();

    return (
        <div>
            <h1>New Game</h1>
            <div className={commonStyles.row}>
                <button
                    className={commonStyles.button}
                    onClick={() => dispatch(createSession(token))}>
                    Create
                </button>
            </div>
        </div>
    );
}
