import {Box, Button, Grid} from "@material-ui/core";
import {Score} from "../score/Score";
import {End} from "../end/End";
import {playerToken, sessionStarted, startGame} from "../../../app/gameStateSlice";
import {FormattedMessage} from "react-intl";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Settings} from "@material-ui/icons";

export function FieldHeader({sessionId, onSettingsClick}: { sessionId: string, onSettingsClick: Function }) {
    const dispatch = useDispatch();

    const token = useSelector(playerToken);
    const started = useSelector(sessionStarted);

    return <Grid container xs={11} sm={12} spacing={2} justify="center">
        {!started &&
        <Grid item xs={12} sm={6}>
            <End/>
        </Grid>
        }
        <Grid item xs>
            <Score/>
        </Grid>
        {!started &&
        <Grid item container xs={6} sm={4} alignItems="center" direction="row-reverse">
            <Grid item style={{paddingRight:"10px"}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => dispatch(startGame(token!, sessionId!))}>
                    <FormattedMessage id="page.game.nextRound"
                                      defaultMessage="Play Another"
                                      description="Button on start game session page"/>
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
