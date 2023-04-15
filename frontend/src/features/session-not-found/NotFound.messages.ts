import { defineMessages } from 'react-intl';

const messages = defineMessages({
    text: {
        id: 'page.session.notFound',
        defaultMessage: 'Unfortunately session #{sessionId}, is not found, create a new one!',
        description: 'Intro text Pt.1 on start game session page',
    },
    button: {
        id: 'page.session.button',
        defaultMessage: 'Go back and create new session',
        description: 'Button on start game session page',
    },
});

export default messages;
