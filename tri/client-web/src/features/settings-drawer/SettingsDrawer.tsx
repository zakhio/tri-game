import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {gameMe, playerToken, setSettings, startGame,} from '../../app/gameStateSlice';
import {useParams} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Box, Button, Divider, Switch} from "@material-ui/core";
import {useIntl} from 'react-intl';
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
import messages from "./SettingsDrawer.messages";

export function SettingsDrawer({open, onClose}: { open?: boolean, onClose: Function }) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const {sessionId} = useParams();

    const token = useSelector(playerToken)
    const me = useSelector(gameMe)

    const captain = me!.initialized && me!.captain;
    const link = gameSessionUrl(sessionId);

    return (
        <Drawer anchor="right" open={open} onClose={() => onClose()}>
            <List>
                <ListItem>
                    <ListItemText
                        primary={intl.formatMessage(messages.titlePrimary)}
                        secondary={intl.formatMessage(messages.titleSecondary, {sessionId})}/>
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={() => dispatch(startGame(token!, sessionId!))}>
                        {intl.formatMessage(messages.restart)}
                    </Button>
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={intl.formatMessage(messages.captainPrimary)}
                        secondary={intl.formatMessage(messages.captainSecondary)}/>
                    <Switch
                        checked={captain}
                        onChange={e => dispatch(setSettings(token!, sessionId!, e.target.checked))}
                        color="secondary"
                        inputProps={{'aria-label': 'captain checkbox'}}
                    />
                </ListItem>
                <Divider variant="middle"/>
                <ListItem>
                    <ListItemText
                        primary={intl.formatMessage(messages.invite)}
                        secondary={
                            <Box component="span">
                                <TelegramShareButton
                                    url={link}
                                    title={intl.formatMessage(messages.inviteMessage)}
                                    style={{marginRight: "4px"}}>
                                    <TelegramIcon size={30} round/>
                                </TelegramShareButton>
                                <FacebookShareButton
                                    url={link}
                                    title={intl.formatMessage(messages.inviteMessage)}
                                    style={{marginRight: "4px"}}>
                                    <FacebookIcon size={30} round/>
                                </FacebookShareButton>
                                <WhatsappShareButton
                                    url={link}
                                    title={intl.formatMessage(messages.inviteMessage)}
                                    style={{marginRight: "4px"}}>
                                    <WhatsappIcon size={30} round/>
                                </WhatsappShareButton>
                                <WeiboShareButton
                                    url={link}
                                    title={intl.formatMessage(messages.inviteMessage)}
                                    style={{marginRight: "4px"}}>
                                    <WeiboIcon size={30} round/>
                                </WeiboShareButton>
                            </Box>
                        }/>
                </ListItem>
            </List>
        </Drawer>
    );
}
