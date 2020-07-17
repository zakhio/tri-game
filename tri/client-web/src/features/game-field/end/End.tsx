import React from 'react';
import Typography from '@material-ui/core/Typography';
import {FormattedMessage} from "react-intl";

export function End() {
    return <Typography variant="h3" align="center">
        <FormattedMessage id="feature.end.message"
                          defaultMessage="End of the game!"
                          description="Message when game is ended"/>
    </Typography>;
}
