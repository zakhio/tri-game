import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { gameLanguage, gameMe, isPlayerCaptain, playerToken, setSettings, startGame, } from '../../app/gameStateSlice';
import { useParams } from "react-router-dom";
import {
    Box,
    Button,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Switch
} from "@mui/material";
import { useIntl } from 'react-intl';
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
import { gameSessionUrl } from "../../app/config";
import messages from "./SettingsDrawer.messages";
import { LanguageSelector } from "../selector-language/LanguageSelector";
import { RestartPopup } from "../popup-restart/RestartPopup";
import { useAppDispatch } from "../../app/store";

export function SettingsDrawer({ open, onClose, setUILocale }: { open?: boolean, onClose: () => void, setUILocale: (locale: string) => void }) {
    const intl = useIntl();
    const dispatch = useAppDispatch();
    const { sessionId } = useParams();

    const token = useSelector(playerToken)
    const currentLanguage = useSelector(gameLanguage);

    const captain = useSelector(isPlayerCaptain);
    const link = gameSessionUrl(sessionId!);

    const [language, setLanguage] = useState(currentLanguage);

    return (
        <Drawer anchor="right" open={open} onClose={() => onClose()}>
            <List>
                <ListItem>
                    <ListItemText
                        primary={intl.formatMessage(messages.titlePrimary)}
                        secondary={intl.formatMessage(messages.titleSecondary, { sessionId })} />
                    <Button
                        variant="text"
                        color="secondary"
                        onClick={() => {
                            dispatch(startGame(token!, sessionId!));
                            onClose();
                        }}>
                        {intl.formatMessage(messages.restart)}
                    </Button>
                </ListItem>
                <ListItem>
                    <ListItemText style={{ marginRight: "5px" }}
                        primary={intl.formatMessage(messages.uiLanguagePrimary)}
                        secondary={intl.formatMessage(messages.uiLanguageSecondary)} />
                    <LanguageSelector setUILocale={setUILocale} />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={intl.formatMessage(messages.languagePrimary)}
                        secondary={intl.formatMessage(messages.languageSecondary)} />
                    <Select
                        labelId="language-select-label"
                        id="language-select"
                        value={language}
                        onChange={(event) => {
                            setLanguage(event.target.value as string);
                            console.log(event)
                        }}
                    >
                        <MenuItem value={'en'}>{intl.formatMessage(messages.english)}</MenuItem>
                        <MenuItem value={'ru'}>{intl.formatMessage(messages.russian)}</MenuItem>
                    </Select>
                    <RestartPopup
                        open={currentLanguage !== language}
                        onAgree={() => {
                            dispatch(startGame(token!, sessionId!, language));
                            onClose();
                        }}
                        onDisagree={() => setLanguage(currentLanguage)} />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={intl.formatMessage(messages.captainPrimary)}
                        secondary={intl.formatMessage(messages.captainSecondary)} />
                    <Switch
                        checked={captain}
                        onChange={e => {
                            dispatch(setSettings(token!, sessionId!, e.target.checked));
                            onClose();
                        }}
                        color="secondary"
                        inputProps={{ 'aria-label': 'captain checkbox' }}
                    />
                </ListItem>
                <Divider variant="middle" />
                <ListItem>
                    <ListItemText
                        primary={intl.formatMessage(messages.invite)}
                        secondary={
                            <Box component="span">
                                <TelegramShareButton
                                    url={link}
                                    title={intl.formatMessage(messages.inviteMessage)}
                                    style={{ marginRight: "4px" }}>
                                    <TelegramIcon size={30} round />
                                </TelegramShareButton>
                                <FacebookShareButton
                                    url={link}
                                    title={intl.formatMessage(messages.inviteMessage)}
                                    style={{ marginRight: "4px" }}>
                                    <FacebookIcon size={30} round />
                                </FacebookShareButton>
                                <WhatsappShareButton
                                    url={link}
                                    title={intl.formatMessage(messages.inviteMessage)}
                                    style={{ marginRight: "4px" }}>
                                    <WhatsappIcon size={30} round />
                                </WhatsappShareButton>
                                <WeiboShareButton
                                    url={link}
                                    title={intl.formatMessage(messages.inviteMessage)}
                                    style={{ marginRight: "4px" }}>
                                    <WeiboIcon size={30} round />
                                </WeiboShareButton>
                            </Box>
                        } />
                </ListItem>
            </List>
        </Drawer>
    );
}
