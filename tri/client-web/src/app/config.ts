export function hostUrl(): string {
    return 'http://' + window.location.host.split(":")[0] + ':8080';
    // return 'https://zakh.io:8080';
}

export function gameSessionUrl(sessionId: string): string {
    return 'http://' + window.location.host + "/tri/" + sessionId;
}
