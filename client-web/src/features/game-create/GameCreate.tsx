import React from 'react';
// @ts-ignore
import commonStyles from '../Common.module.css';
import {useDispatch} from 'react-redux';
import {createGame,} from '../../app/gameStateSlice';

export function GameCreate() {
    const dispatch = useDispatch();

    return (
        <div>
            <h1>New Game</h1>
            <div className={commonStyles.row}>
                <button
                    className={commonStyles.button}
                    onClick={() => dispatch(createGame())}>
                    Create
                </button>
            </div>
        </div>
    );
}
