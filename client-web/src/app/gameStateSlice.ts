import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ClientReadableStream, Error} from 'grpc-web';
import {AppThunk, RootState} from './store';
import {TRIGameClient} from '../proto/TriServiceClientPb';
import {
    Word,
    CreateGameReply,
    CreateGameRequest,
    CurrentPlayer,
    GameSessionStream,
    JoinGameRequest,
    Player,
    StartGameRequest,
    TurnGameRequest
} from '../proto/tri_pb';
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {hostUrl} from "./config";

interface CurrentSession {
    sessionId: string;
    creatorToken: string;
}

interface GameState {
    sessionId: string | null;
    token: string | null;
    connected: boolean;
    me?: CurrentPlayer.AsObject;
    players: Player.AsObject[];
    words: Word.AsObject[];
    numOfColumns: number;
}

const initialState: GameState = {
    sessionId: null,
    token: null,
    connected: false,
    me: undefined,
    players: [],
    words: [],
    numOfColumns: 0,
};

// const client = new TRIGameClient('http://localhost:8080', null, null);
const client = new TRIGameClient( hostUrl(), null, null);
let stream: ClientReadableStream<GameSessionStream>;

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        replaceCurrentState: (state, action: PayloadAction<GameSessionStream.AsObject>) => {
            state.words = action.payload.wordsList
            state.numOfColumns = action.payload.numberofcolumns;
            state.players = action.payload.playersList
            state.me = action.payload.me
        },
        resetCurrentState: (state, action: PayloadAction<void>) => {
            state.words = []
            state.players = []
            state.me = undefined
            state.connected = false
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        replaceCurrentSession: (state, action: PayloadAction<CurrentSession>) => {
            state.sessionId = action.payload.sessionId;
            state.token = action.payload.creatorToken;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        replaceConnected: (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload;
        },
    },
});

export const {replaceCurrentState, resetCurrentState, replaceCurrentSession, replaceConnected} = gameStateSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const joinAsync = (sessionId: string, playerName: string | null, token: string | null): AppThunk => dispatch => {
    if (stream) {
        stream.cancel();
    }

    localStorage.setItem("sessionId", sessionId);
    console.log(client.hostname_)

    const joinReq = new JoinGameRequest();
    joinReq.setSessionid(sessionId);
    if (playerName) {
        joinReq.setPlayername(playerName);
    }
    if (token) {
        joinReq.setPlayertoken(token);
    }

    stream = client.join(joinReq);
    stream.on('data', (res) => {
        console.log("stream.data", res.toObject());
        if (res.getMe() && res.getMe()?.getToken()) {
            localStorage.setItem("token", res.getMe()!.getToken());
        }

        dispatch(replaceConnected(true));
        dispatch(replaceCurrentState(res.toObject()));
    });

    stream.on("error", (err) => {
        console.log("stream.error", err);
        // localStorage.removeItem("sessionId");
        // localStorage.removeItem("token");
        // dispatch(resetCurrentState());
    });

    stream.on("end", () => {
        console.log("stream.end");
        // dispatch(resetCurrentState());
    });
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const createGame = (): AppThunk => dispatch => {
    const req = new CreateGameRequest();
    client.create(req, null, (err: Error, res: CreateGameReply) => {
        if (err) {
            console.log(err);
            return;
        }
        const currentSession = {
            sessionId: res.getSessionid(),
            creatorToken: res.getCreatortoken(),
        }
        localStorage.setItem("sessionId", currentSession.sessionId);
        localStorage.setItem("token", currentSession.creatorToken);

        dispatch(replaceCurrentSession(currentSession))
        dispatch(joinAsync(currentSession.sessionId, null, currentSession.creatorToken))
    });
};

export const checkCurrentSession = (): AppThunk => dispatch => {
    const sessionId = localStorage.getItem("sessionId");
    const creatorToken = localStorage.getItem("token");

    if (creatorToken && sessionId) {
        const currentSession = {
            sessionId,
            creatorToken,
        }

        if (currentSession.creatorToken && currentSession.sessionId) {
            dispatch(replaceCurrentSession(currentSession))
            dispatch(joinAsync(currentSession.sessionId, null, currentSession.creatorToken))
        }
    }
};

export const startGame = (sessionId: string, playerToken: string): AppThunk => dispatch => {
    const req = new StartGameRequest();
    req.setSessionid(sessionId);
    req.setPlayertoken(playerToken);
    req.setNumberofcolumns(5);
    req.setNumberofrows(5);
    client.start(req, null, (err: Error, response: Empty) => {
    });
};

export const turn = (sessionId: string, playerToken: string, position: number): AppThunk => dispatch => {
    const req = new TurnGameRequest();
    req.setSessionid(sessionId);
    req.setPlayertoken(playerToken);
    req.setPosition(position);
    client.turn(req, null, (err: Error, response: Empty) => {
    });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const sessionNumOfColumns = (state: RootState) => state.gameState.numOfColumns;
export const sessionWords = (state: RootState) => state.gameState.words;
export const sessionMe = (state: RootState) => state.gameState.me;
export const sessionPlayers = (state: RootState) => state.gameState.players;
export const playerSessionId = (state: RootState) => state.gameState.sessionId;
export const playerToken = (state: RootState) => state.gameState.token;
export const sessionConnected = (state: RootState) => state.gameState.connected;

export default gameStateSlice.reducer;
