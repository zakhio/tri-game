import { defineMessages } from 'react-intl';

const messages = defineMessages({
    title: {
        id: 'popup.restart.title',
        defaultMessage: 'Restart game',
        description: 'Title on start new round popup',
    },
    text: {
        id: 'popup.restart.text',
        defaultMessage: 'You are going restart game with new language.',
        description: 'Description on start new round popup',
    },
    agree: {
        id: 'popup.restart.agree',
        defaultMessage: 'Agree',
        description: 'Call to action on start new round popup',
    },
    disagree: {
        id: 'popup.restart.disagree',
        defaultMessage: 'Disagree',
        description: 'Text on start new round popup',
    },
});

export default messages;
