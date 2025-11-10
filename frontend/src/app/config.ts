export function gameSessionUrl(sessionId: string): string {
    return window.location.protocol + '//' + window.location.host + "/" + sessionId;
}

export default function isDev(): boolean
{
  return import.meta.env.DEV;
}