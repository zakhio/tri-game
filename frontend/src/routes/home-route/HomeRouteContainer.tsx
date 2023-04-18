import { PageHome } from "../../features/page-home/PageHome";
import React from "react";

export function HomeRouteContainer({ setLocale }: { setLocale: (locale: string) => void }) {
    return <>
        <PageHome setLocale={setLocale} />
    </>
}
