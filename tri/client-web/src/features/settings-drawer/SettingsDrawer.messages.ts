import {defineMessages} from 'react-intl';

const messages = defineMessages({
    titlePrimary: {
        id: 'settings.title.primary',
        defaultMessage: 'TRI Game',
        description: 'Title for share window in provider window',
    },
    titleSecondary: {
        id: 'settings.title.secondary',
        defaultMessage: 'Session #{sessionId}',
        description: 'Title for share window in provider window',
    },
    captainPrimary: {
        id: 'settings.captain.primary',
        defaultMessage: 'Captain Role',
        description: 'Title for share window in provider window',
    },
    captainSecondary: {
        id: 'settings.captain.secondary',
        defaultMessage: 'See all cards and lead',
        description: 'Title for share window in provider window',
    },
    restart: {
        id: 'page.game.restart',
        defaultMessage: 'Restart',
        description: 'Button on restart game session page',
    },
    invite: {
        id: 'feature.invite.text',
        defaultMessage: 'Invite friends to current session:',
        description: 'Text for inviting friend for the game session',
    },
    inviteMessage: {
        id: 'feature.invite.text',
        defaultMessage: 'Invite friends to current session:',
        description: 'Text for inviting friend for the game session',
    },
});

export default messages;
