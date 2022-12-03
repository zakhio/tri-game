import {defineMessages} from 'react-intl';

const messages = defineMessages({
    title: {
        id: 'popup.startRound.title',
        defaultMessage: 'Start of the new round',
        description: 'Title on start new round popup',
    },
    welcome: {
        id: 'popup.startRound.description',
        defaultMessage: 'Welcome to the new round! Decide who is in your team and if who is the captain.',
        description: 'Description on start new round popup',
    },
    callToAction: {
        id: 'popup.startRound.actionText',
        defaultMessage: 'Press a button corresponding your role to start playing. Good luck!',
        description: 'Call to action on start new round popup',
    },
    settingsInfo: {
        id: 'popup.startRound.settings',
        defaultMessage: 'You can change your choice by clicking button ',
        description: 'Text on start new round popup',
    },
    captainRole: {
        id: 'popup.startRound.captainButton',
        defaultMessage: 'Play as Captain',
        description: 'Button to plays as captain',
    },
    regularRole: {
        id: 'popup.startRound.regularButton',
        defaultMessage: 'Play as Regular',
        description: 'Button to play as regular player',
    },
});

export default messages;
