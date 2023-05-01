export function gameSessionUrl(sessionId: string): string {
    return window.location.protocol + '//' + window.location.host + "/" + sessionId;
}
