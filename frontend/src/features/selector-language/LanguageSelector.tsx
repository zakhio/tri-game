import React from "react";
import { useIntl } from "react-intl";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export function LanguageSelector({ setUILocale }: { setUILocale: (locale: string) => void }) {
    const intl = useIntl();

    return (
        <ToggleButtonGroup
            value={intl.locale}
            exclusive
            onChange={(event, locale) => setUILocale(locale)}
            aria-label="text alignment">
            <ToggleButton value="en" aria-label="left aligned">
                <span role="img" aria-label="english language">En</span>
            </ToggleButton>
            <ToggleButton value="ru" aria-label="centered">
                <span role="img" aria-label="russian language">Ру</span>
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
