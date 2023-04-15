import React from 'react';
import Typography from '@mui/material/Typography';
import { useIntl } from 'react-intl';
import messages from "./End.messages";

export function End() {
    const intl = useIntl();

    return <Typography variant="h3" align="center">
        {intl.formatMessage(messages.text)}
    </Typography>;
}
