import {Box, Button, Grid} from "@material-ui/core";
import {Score} from "../score/Score";
import {End} from "../end/End";
import {playerToken, sessionStarted, startGame} from "../../../app/gameStateSlice";
import {useIntl} from 'react-intl';
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Settings} from "@material-ui/icons";
import messages from "./FieldHeader.messages";

export function FieldHeader({sessionId, onSettingsClick}: { sessionId: string, onSettingsClick: Function }) {
    const intl = useIntl();
    const dispatch = useDispatch();

    const token = useSelector(playerToken);
    const started = useSelector(sessionStarted);

    return <Grid item container xs={started ? 12 : 11} sm={12} spacing={2} justify="center">
        {!started &&
        <Grid item xs={12} sm={4}>
            <End/>
        </Grid>
        }
        <Grid item xs>
            <Score/>
        </Grid>
        {!started &&
        <Grid item container xs={6} sm={4} alignItems="center" direction="row-reverse">
            <Grid item style={{paddingRight: "10px"}}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => dispatch(startGame(token!, sessionId!))}>
                    {intl.formatMessage(messages.playAnotherOne)}
                </Button>
            </Grid>
        </Grid>
        }
        <Box position="absolute" top={10} right={10}>
            <Button onClick={() => onSettingsClick()}>
                <Settings fontSize="large"/>
            </Button>
        </Box>
    </Grid>
}
