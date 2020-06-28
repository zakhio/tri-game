import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {playerSessionId, playerToken, startGame,} from '../../app/gameStateSlice';
import {PlayerList} from "../user-list/PlayerList";
import styles from "./GameIntro.module.css"
import commonStyles from "../Common.module.css";
import {GameShare} from "../link-join/GameShare";

export function GameIntro() {
    const token = useSelector(playerToken);
    const sessionId = useSelector(playerSessionId);
    const dispatch = useDispatch();

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.cell}>
                    <p>Капитаны знают тайные личности 25 агентов. Игроки же знают агентов только по их кодовым
                        именам.</p>
                    <p> Капитаны по очереди дают подсказки, состоящие из одного слова. Слово может относиться к
                        нескольким кодовым именам, выложенным на столе. Игроки пытаются отгадать кодовые имена, которые
                        имеет в виду их капитан. Как только игрок касается карточки с кодовым именем,
                        капитан раскрывает тайную личность этого кодового имени. Если это агент, относящийся к их
                        команде, игроки продолжают отгадывать, пока не ошибутся или не израсходуют свои попытки.</p>
                    <p> Команда, которой первой удалось найти всех своих агентов, выигрывает.</p></div>
                <div className={styles.cell}><PlayerList/></div>
            </div>
            <div className={styles.container}>
                <div>
                    <button
                        disabled={!sessionId || !token}
                        className={commonStyles.button}
                        onClick={() => dispatch(startGame(token!, sessionId!))}>
                        Start
                    </button>
                </div>
                <GameShare/>
            </div>
        </div>
    );
}
