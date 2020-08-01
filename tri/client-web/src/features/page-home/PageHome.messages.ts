import {defineMessages} from 'react-intl';

const messages = defineMessages({
    title: {
        id: 'page.home.title',
        defaultMessage: 'Welcome to Game TRI. Create new or join to existing session',
        description: 'Welcome title on join game session page',
    },
    or: {
        id: 'page.home.orJoin',
        defaultMessage: 'Or join existing session',
        description: 'Welcome title on join game session page',
    },
    sessionId: {
        id: 'page.home.sessionId',
        defaultMessage: 'Session ID',
        description: 'Title for session id input on join session page',
    },
    join: {
        id: 'page.home.join',
        defaultMessage: 'Join',
        description: 'Button on join game session page',
    },
    create: {
        id: 'page.home.create',
        defaultMessage: 'Create Game Session',
        description: 'Button on create game session page',
    },
});

export default messages;
