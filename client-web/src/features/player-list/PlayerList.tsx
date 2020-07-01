import React from 'react';
// @ts-ignore
import {useSelector} from 'react-redux';
import {sessionPlayers} from '../../app/gameStateSlice';
import {FormattedMessage} from "react-intl";
import {Grid, List, ListItem, ListItemText, Typography} from "@material-ui/core";

export function PlayerList() {
    const players = useSelector(sessionPlayers);

    const p = players.map((player, i) =>
        <ListItem key={i}>
            <ListItemText primary={player.alias}/>
        </ListItem>
    );

    return (
        <Grid container direction="column">
            <Grid item>
                <Typography variant="h4" align="center">

                    <FormattedMessage id="feature.players.title"
                                      defaultMessage="Players"
                                      description="Title for player list"/>
                </Typography>
            </Grid>
            <Grid item>
                <List>
                    {p}
                </List>
            </Grid>
        </Grid>
    );
}
