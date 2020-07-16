export function hostUrl(): string {
    // extracts only last two parts from host name
    // for example, foo.bar.com -> bar.com or localhost -> localhost
    const domainParts = window.location.hostname.split(".");
    const domainStart = Math.max(0, domainParts.length - 2);
    const serviceUrl = domainParts.slice(domainStart)

    return window.location.protocol + '//' + serviceUrl.join(".") + ':8080';
}

export function gameSessionUrl(sessionId: string): string {
    return 'http://' + window.location.host + "/tri/" + sessionId;
}
