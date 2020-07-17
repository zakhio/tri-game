import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {playerToken, sessionMe, setSettings, startGame,} from '../../app/gameStateSlice';
import {useParams} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Button, Divider, Switch} from "@material-ui/core";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    WeiboIcon,
    WeiboShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import {gameSessionUrl} from "../../app/config";

const messages = defineMessages({
    title_primary: {
        id: 'settings.title.primary',
        defaultMessage: 'TRI Game',
        description: 'Title for share window in provider window',
    },
    title_secondary: {
        id: 'settings.title.secondary',
        defaultMessage: 'Session #{sessionId}',
        description: 'Title for share window in provider window',
    },
    captain_primary: {
        id: 'settings.captain.primary',
        defaultMessage: 'Captain Role',
        description: 'Title for share window in provider window',
    },
    captain_secondary: {
        id: 'settings.captain.secondary',
        defaultMessage: 'See all cards and lead',
        description: 'Title for share window in provider window',
    },
});

export function SettingsDrawer({open, onClose}: { open?: boolean, onClose: Function }) {
    const {sessionId} = useParams();

    const token = useSelector(playerToken)
    const me = useSelector(sessionMe)
    const dispatch = useDispatch();

    const captain = me!.captain !== undefined && me!.captain.value;

    const intl = useIntl();
    const link = gameSessionUrl(sessionId);

    return (
        <Drawer anchor="right" open={open} onClose={() => onClose()}>
            <List>
                <ListItem>
                    <ListItemText
                        primary={intl.formatMessage(messages.title_primary)}
                        secondary={intl.formatMessage(messages.title_secondary, {sessionId})}/>
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={() => dispatch(startGame(token!, sessionId!))}>
                        <FormattedMessage id="page.game.restart"
                                          defaultMessage="Restart"
                                          description="Button on restart game session page"/>
                    </Button>
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={intl.formatMessage(messages.captain_primary)}
                        secondary={intl.formatMessage(messages.captain_secondary)}/>
                    <Switch
                        checked={captain}
                        onChange={e => dispatch(setSettings(token!, sessionId!, undefined, e.target.checked))}
                        color="secondary"
                        inputProps={{'aria-label': 'captain checkbox'}}
                    />
                </ListItem>
                <Divider variant="middle"/>
                <ListItem>
                    <ListItemText
                        primary={
                            <FormattedMessage id="feature.invite.text"
                                              defaultMessage="Invite friends to current session:"
                                              description="Text for inviting friend for the game session"
                                              values={{sessionId}}/>
                        }
                        secondary={
                            <span>
                                <TelegramShareButton url={link} title={"test"} style={{marginRight: "4px"}}>
                                    <TelegramIcon size={30} round/>
                                </TelegramShareButton>
                                <FacebookShareButton url={link} style={{marginRight: "4px"}}>
                                    <FacebookIcon size={30} round/>
                                </FacebookShareButton>
                                <WhatsappShareButton url={link} style={{marginRight: "4px"}}>
                                    <WhatsappIcon size={30} round/>
                                </WhatsappShareButton>
                                <WeiboShareButton url={link} style={{marginRight: "4px"}}>
                                    <WeiboIcon size={30} round/>
                                </WeiboShareButton>
                            </span>
                        }/>
                </ListItem>
            </List>
        </Drawer>
    );
}
