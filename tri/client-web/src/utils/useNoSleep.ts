import NoSleep from "nosleep.js";
import {useEffect, useMemo, useState} from "react";

export const useNoSleep = (enabled: boolean) => {
    const [alreadyEnabled, setAlreadyEnabled] = useState(false);
    const noSleep = useMemo(() => new NoSleep(), []);

    useEffect(() => {
        if (alreadyEnabled === enabled) {
            return;
        }

        let isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)

        if (isMobile && enabled) {
            document.addEventListener('click', function enableNoSleep() {
                document.removeEventListener('click', enableNoSleep, false);
                noSleep.enable();
            }, false);
        } else {
            noSleep.disable();
        }

        setAlreadyEnabled(enabled);
    }, [alreadyEnabled, enabled, noSleep]);
};

export default useNoSleep;
