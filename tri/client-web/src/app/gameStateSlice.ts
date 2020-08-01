import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ClientReadableStream, Error, Status, StatusCode} from 'grpc-web';
import {AppThunk, RootState} from './store';
import {TRIGameClient} from '../proto/TriServiceClientPb';
import {v4} from 'uuid';
import {
    Cell,
    CreateSessionReply,
    CreateSessionRequest,
    GameSessionStream,
    ObserveSessionRequest,
    Player,
    SetSettingsRequest,
    StartGameRequest,
    Team,
    TurnGameRequest
} from '../proto/tri_pb';
import {Empty} from "google-protobuf/google/protobuf/empty_pb";
import {hostUrl} from "./config";
import {History, LocationState} from "history";

export enum StreamStatus {
    Idle = 1,
    Connecting,
    Connected,
    Failed,
}

interface GameState {
    token: string;

    streamStatus: StreamStatus;
    connectionStatus: Status | null;
    notFound: boolean;
    serverUnavailable: boolean;

    started: boolean;
    me?: Player.AsObject;
    players: Player.AsObject[];
    teams: Team.AsObject[];
    cells: Cell.AsObject[];
    numOfColumns: number;
}

const initialState: GameState = {
    token: localStorage.getItem("token") || v4(),
    streamStatus: StreamStatus.Idle,
    notFound: false,
    serverUnavailable: false,
    connectionStatus: null,
    started: false,
    me: undefined,
    players: [],
    teams: [],
    cells: [],
    numOfColumns: 0,
};

const client = new TRIGameClient(hostUrl(), null, null);
let stream: ClientReadableStream<GameSessionStream>;

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        replaceGameState: (state, action: PayloadAction<GameSessionStream.AsObject>) => {
            state.cells = action.payload.cellsList
            state.numOfColumns = action.payload.numberofcolumns;
            state.teams = action.payload.teamsList
            state.started = action.payload.started

            const myId = action.payload.playerid;
            const players = action.payload.playersList;
            state.players = players;

            for (let i = 0; i < players.length; i++) {
                if (players[i].id === myId) {
                    state.me = players[i];
                }
            }
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        replaceStreamStatus: (state, action: PayloadAction<StreamStatus>) => {
            state.streamStatus = action.payload;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        replaceConnectionStatus: (state, action: PayloadAction<Status | null>) => {
            let status = action.payload;

            state.connectionStatus = status;
            if (!status) {
                state.notFound = false;
                state.serverUnavailable = false;
                state.streamStatus = StreamStatus.Idle;
            } else if (status.code === StatusCode.UNAVAILABLE) {
                state.serverUnavailable = true;
                state.streamStatus = StreamStatus.Failed;
            } else if (status.code === StatusCode.NOT_FOUND) {
                state.notFound = true;
                state.streamStatus = StreamStatus.Failed;
            } else if (status.code === StatusCode.UNKNOWN) {
                state.streamStatus = StreamStatus.Idle;
            }
        },
    },
});

export const {replaceGameState, replaceStreamStatus, replaceConnectionStatus} = gameStateSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const joinAsync = (token: string, sessionId: string, history?: History<LocationState>): AppThunk => (dispatch, getState) => {
    if (getState().gameState.streamStatus === StreamStatus.Connecting) {
        return
    }

    if (stream) {
        stream.cancel();
    }

    localStorage.setItem("token", token);
    const observerReq = new ObserveSessionRequest();
    observerReq.setSessionid(sessionId);
    observerReq.setToken(token);
    console.log('join', token)

    stream = client.observeSession(observerReq);
    dispatch(replaceStreamStatus(StreamStatus.Connecting));
    stream.on('status', (status: Status) => {
        dispatch(replaceConnectionStatus(status));
    });

    stream.on('data', (res) => {
        if (history) {
            history.push("/" + sessionId);
        }

        dispatch(replaceGameState(res.toObject()));
        dispatch(replaceStreamStatus(StreamStatus.Connected));
    });

    stream.on("end", () => {
        dispatch(replaceStreamStatus(StreamStatus.Idle));
    });
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const createSession = (token: string, history: History<LocationState>): AppThunk => dispatch => {
    const req = new CreateSessionRequest();
    req.setToken(token);
    localStorage.setItem("token", token);

    client.createSession(req, null, (err: Error, res: CreateSessionReply) => {
        if (err) {
            console.log(err);
            return;
        }
        const sessionId: string = res.getSessionid();
        history.push("/" + sessionId);
        dispatch(replaceConnectionStatus(null))
    });
};

export const autoJoinSession = (token: string, sessionId: string): AppThunk => dispatch => {
    if (token && sessionId) {
        dispatch(joinAsync(token, sessionId))
    }
};

export const startGame = (token: string, sessionId: string): AppThunk => dispatch => {
    const req = new StartGameRequest();
    req.setToken(token);
    req.setSessionid(sessionId);
    req.setNumberofcolumns(5);
    req.setNumberofrows(5);
    client.start(req, null, (err: Error, response: Empty) => {
    });
};

export const turn = (token: string, sessionId: string, position: number): AppThunk => dispatch => {
    const req = new TurnGameRequest();
    req.setToken(token)
    req.setSessionid(sessionId);
    req.setPosition(position);
    client.turn(req, null, (err: Error, response: Empty) => {
    });
};

export const setSettings = (token: string, sessionId: string, captain?: boolean): AppThunk => dispatch => {
    const req = new SetSettingsRequest();
    req.setToken(token)
    req.setSessionid(sessionId);
    if (captain) {
        req.setCaptain(captain);
    }
    client.setSettings(req, null, (err: Error, response: Empty) => {
    });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const gameNumOfColumns = (state: RootState) => state.gameState.numOfColumns;
export const gameCells = (state: RootState) => state.gameState.cells;
export const gameTeams = (state: RootState) => state.gameState.teams;
export const gamePlayers = (state: RootState) => state.gameState.players;
export const gameStarted = (state: RootState) => state.gameState.started;
export const gameMe = (state: RootState) => state.gameState.me;
export const sessionNotFound = (state: RootState) => state.gameState.notFound;
export const playerToken = (state: RootState) => state.gameState.token;
export const sessionStatus = (state: RootState) => state.gameState.streamStatus;

export default gameStateSlice.reducer;
