import React from 'react';
// @ts-ignore
import {useSelector} from 'react-redux';
import {sessionPlayers} from '../../app/gameStateSlice';
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Grid, List, ListItem, ListItemText, Typography} from "@material-ui/core";

const messages = defineMessages({
    noname: {
        id: 'feature.playerlist.noname',
        defaultMessage: 'Noname',
        description: 'Field for player name input on missing player name popup',
    },
});

export function PlayerList() {
    const intl = useIntl();
    const players = useSelector(sessionPlayers);

    const p = players.map((player, i) =>
        <ListItem key={i}>
            <ListItemText primary={player.alias || intl.formatMessage(messages.noname)}/>
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
