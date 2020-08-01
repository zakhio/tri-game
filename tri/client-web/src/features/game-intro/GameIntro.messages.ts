import {defineMessages} from 'react-intl';

const messages = defineMessages({
    p1: {
        id: 'page.start.intro.p1',
        defaultMessage: 'Captains know the secret identities of 25 agents. Players know agents only by their code names.',
        description: 'Intro text Pt.1 on start game session page',
    },
    p2: {
        id: 'page.start.intro.p2',
        defaultMessage: 'Captains take turns giving one-word hints. A word can refer to several code names laid out on a table. Players are trying to guess the code names that their captain means. As soon as a player touches a card with a code name, the captain reveals the secret identity of this code name. If this is an agent related to their team, players continue to guess until they make a mistake or use up their attempts.',
        description: 'Intro text Pt.2 on start game session page',
    },
    p3: {
        id: 'page.start.intro.p3',
        defaultMessage: 'The team that was the first to find all of its agents wins.',
        description: 'Intro text Pt.3 on start game session page',
    },
    ruButton: {
        id: 'page.start.ruButton',
        defaultMessage: 'Russian',
        description: 'Button on start game session page',
    },
    enButton: {
        id: 'page.start.enButton',
        defaultMessage: 'English',
        description: 'Button on start game session page',
    },
});

export default messages;
