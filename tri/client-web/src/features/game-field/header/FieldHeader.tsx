import {Button, Grid} from "@material-ui/core";
import {Score} from "../score/Score";
import {End} from "../end/End";
import {playerToken, sessionStarted, startGame} from "../../../app/gameStateSlice";
import {FormattedMessage} from "react-intl";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

export function FieldHeader({sessionId}: { sessionId: string }) {
    const dispatch = useDispatch();

    const token = useSelector(playerToken);
    const started = useSelector(sessionStarted);

    return <Grid container spacing={2} justify="center" alignItems="center">
        <Grid item xs>
            <Score/>
        </Grid>
        {!started &&
        <Grid item xs={7}>
            <End/>
        </Grid>
        }
        {!started &&
        <Grid item container xs direction="row-reverse">
            <Grid item>
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
        {/*<Settings onClick={() => onSettings()}/>*/
        }
    </Grid>
}
