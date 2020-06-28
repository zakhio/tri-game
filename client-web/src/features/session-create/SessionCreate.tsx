import React from 'react';
// @ts-ignore
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from "react-router-dom";
import {createSession, playerToken,} from '../../app/gameStateSlice';

export function SessionCreate() {
    const history = useHistory();
    const token = useSelector(playerToken)
    const dispatch = useDispatch();

    return (
        <div>
            <h1>Welcome to TRI game</h1>
            <div className={commonStyles.row}>
                <button
                    className={commonStyles.button}
                    onClick={() => dispatch(createSession(token, history))}>
                    Create Game Session
                </button>
            </div>
        </div>
    );
}
