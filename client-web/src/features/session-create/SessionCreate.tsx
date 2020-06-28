import React from 'react';
// @ts-ignore
import commonStyles from '../Common.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from "react-router-dom";
import {createSession, playerToken,} from '../../app/gameStateSlice';
import {FormattedMessage} from "react-intl";

export function SessionCreate() {
    const history = useHistory();
    const token = useSelector(playerToken)
    const dispatch = useDispatch();

    return (
        <div>
            <h1>
                <FormattedMessage id="page.create.title"
                                  defaultMessage="Welcome to TRI game"
                                  description="Welcome title on create game session page"/>
            </h1>
            <div className={commonStyles.row}>
                <button
                    className={commonStyles.button}
                    onClick={() => dispatch(createSession(token, history))}>
                    <FormattedMessage id="page.create.button"
                                      defaultMessage="Create Game Session"
                                      description="Button on create game session page"/>
                </button>
            </div>
        </div>
    );
}
