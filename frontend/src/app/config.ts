export function hostUrl(): string {
    const domainParts = window.location.hostname.split(".");
    const tld = domainParts[domainParts.length - 1];
    let serviceUrl;

    // primitive check if last part of url is number then hostname is IP address
    if (tld === parseInt(tld).toString()) {
        serviceUrl = domainParts
    } else {
        // extracts only last two parts from host name
        // for example, foo.bar.com -> bar.com or localhost -> localhost
        const domainStart = Math.max(0, domainParts.length - 2);
        serviceUrl = domainParts.slice(domainStart)
    }

    return window.location.protocol + '//' + serviceUrl.join(".") + ':8080';
}

export function gameSessionUrl(sessionId: string): string {
    return window.location.protocol + '//' + window.location.host + "/" + sessionId;
}
