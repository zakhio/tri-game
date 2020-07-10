import React from 'react';
import fieldStyles from '../GameField.module.css';
import {useSelector} from 'react-redux';
import {sessionTeams,} from '../../../app/gameStateSlice';
import Typography from '@material-ui/core/Typography';
import {defineMessages, FormattedMessage} from "react-intl";

export function End() {
    // const teams = useSelector(sessionTeams)
    // let noWinners = true;
    // let winnerTeam = teams[0].id;
    // teams.forEach(t => {
    //     if (t.remainingcount === 0) {
    //         noWinners = false;
    //         winnerTeam = t.id;
    //     }
    // });

    return <Typography variant="h3" align="center">
        <FormattedMessage id="feature.end.message"
                          defaultMessage="End of the game!"
                          description="Message when game is ended"/>
    </Typography>;
}
