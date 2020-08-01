import {ToggleButton, ToggleButtonGroup} from "@material-ui/lab";
import React from "react";
import {useIntl} from "react-intl";

export function LanguageSelector({setUILocale}: { setUILocale: (locale: string) => void }) {
    const intl = useIntl();

    return (
        <ToggleButtonGroup
            value={intl.locale}
            exclusive
            onChange={(event, locale) => setUILocale(locale)}
            aria-label="text alignment">
            <ToggleButton value="en" aria-label="left aligned">
                <span role="img" aria-label="english language">🇺🇸</span>
            </ToggleButton>
            <ToggleButton value="ru" aria-label="centered">
                <span role="img" aria-label="russian language">🇷🇺</span>
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
