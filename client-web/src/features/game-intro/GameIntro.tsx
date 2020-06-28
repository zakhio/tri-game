import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {playerSessionId, playerToken, startGame,} from '../../app/gameStateSlice';
import {PlayerList} from "../player-list/PlayerList";
import styles from "./GameIntro.module.css"
import commonStyles from "../Common.module.css";
import {SessionShare} from "../session-share/SessionShare";
import {FormattedMessage} from "react-intl";

export function GameIntro() {
    const token = useSelector(playerToken);
    const sessionId = useSelector(playerSessionId);
    const dispatch = useDispatch();

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.cell}>
                    <p>
                        <FormattedMessage id="page.start.intro.p1"
                                          defaultMessage="Captains know the secret identities of 25 agents. Players know agents only by their code names."
                                          description="Intro text Pt.1 on start game session page"/>
                    </p>
                    <p>
                        <FormattedMessage id="page.start.intro.p2"
                                          defaultMessage="Captains take turns giving one-word hints. A word can refer to several code names laid out on a table. Players are trying to guess the code names that their captain means. As soon as a player touches a card with a code name, the captain reveals the secret identity of this code name. If this is an agent related to their team, players continue to guess until they make a mistake or use up their attempts."
                                          description="Intro text Pt.2 on start game session page"/>
                    </p>
                    <p>
                        <FormattedMessage id="page.start.intro.p3"
                                          defaultMessage="The team that was the first to find all of its agents wins."
                                          description="Intro text Pt.3 on start game session page"/>
                    </p>
                </div>
                <div className={styles.cell}>
                    <PlayerList/>
                </div>
            </div>
            <div className={styles.row}>
                <div>
                    <button
                        disabled={!sessionId || !token}
                        className={commonStyles.button}
                        onClick={() => dispatch(startGame(token!, sessionId!))}>
                        <FormattedMessage id="page.start.button"
                                          defaultMessage="Start"
                                          description="Button on start game session page"/>
                    </button>
                </div>
                <SessionShare/>
            </div>
        </div>
    );
}
