import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {playerToken, startGame,} from '../../app/gameStateSlice';
import {FormattedMessage} from "react-intl";
import {Button, Grid, Typography} from "@material-ui/core";
import {PlayerList} from "../player-list/PlayerList";

export function GameIntro({sessionId}: { sessionId: string }) {
    const token = useSelector(playerToken);
    const dispatch = useDispatch();

    return (
        <Grid container xs={12} spacing={3}>
            <Grid item xs={12} sm={2}>
                <img src="icon.svg" alt="Game TRI logo"/>
            </Grid>
            <Grid item xs={12} sm={10} wrap="nowrap" >
                <Typography variant="body1" gutterBottom>
                    <FormattedMessage id="page.start.intro.p1"
                                      defaultMessage="Captains know the secret identities of 25 agents. Players know agents only by their code names."
                                      description="Intro text Pt.1 on start game session page"/>
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <FormattedMessage id="page.start.intro.p2"
                                      defaultMessage="Captains take turns giving one-word hints. A word can refer to several code names laid out on a table. Players are trying to guess the code names that their captain means. As soon as a player touches a card with a code name, the captain reveals the secret identity of this code name. If this is an agent related to their team, players continue to guess until they make a mistake or use up their attempts."
                                      description="Intro text Pt.2 on start game session page"/>
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <FormattedMessage id="page.start.intro.p3"
                                      defaultMessage="The team that was the first to find all of its agents wins."
                                      description="Intro text Pt.3 on start game session page"/>
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container justify="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => dispatch(startGame(token!, sessionId!))}>
                        <FormattedMessage id="page.start.button"
                                          defaultMessage="Start"
                                          description="Button on start game session page"/>
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}
