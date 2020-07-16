import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ClientReadableStream, Error} from 'grpc-web';
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

interface GameState {
    token: string;
    connected: boolean;
    me?: Player.AsObject;
    players: Player.AsObject[];
    teams: Team.AsObject[];
    cells: Cell.AsObject[];
    numOfColumns: number;
    started: boolean;
    streamStatus: string;
}

const initialState: GameState = {
    token: localStorage.getItem("token") || v4(),
    connected: false,
    me: undefined,
    players: [],
    teams: [],
    cells: [],
    numOfColumns: 0,
    started: false,
    streamStatus: "disconnected"
};

const client = new TRIGameClient(hostUrl(), null, null);
let stream: ClientReadableStream<GameSessionStream>;

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        replaceCurrentState: (state, action: PayloadAction<GameSessionStream.AsObject>) => {
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
        replaceConnected: (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload;
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        replaceStreamStatus: (state, action: PayloadAction<string>) => {
            state.streamStatus = action.payload;
        },
    },
});

export const {replaceCurrentState, replaceConnected, replaceStreamStatus} = gameStateSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const joinAsync = (token: string, sessionId: string): AppThunk => dispatch => {
    if (stream) {
        stream.cancel();
    }

    localStorage.setItem("token", token);
    const observerReq = new ObserveSessionRequest();
    observerReq.setSessionid(sessionId);
    observerReq.setToken(token);

    stream = client.observeSession(observerReq);
    stream.on('data', (res) => {
        dispatch(replaceCurrentState(res.toObject()));
        dispatch(replaceConnected(true));
        dispatch(replaceStreamStatus("data"))
    });

    stream.on("error", (err) => {
        dispatch(replaceStreamStatus("error" + err))
        dispatch(joinAsync(token, sessionId));
    });

    stream.on("end", () => {
        dispatch(replaceStreamStatus("end"))
    });
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const tryJoinAsync = (token: string, sessionId: string, playerName:string, history: History<LocationState>): AppThunk => dispatch => {
    if (stream) {
        stream.cancel();
    }

    localStorage.setItem("token", token);
    const observerReq = new ObserveSessionRequest();
    observerReq.setSessionid(sessionId);
    observerReq.setToken(token);

    stream = client.observeSession(observerReq);
    stream.on('data', (res) => {
        stream.cancel();
        dispatch(setSettings(token, sessionId, playerName));
        history.push("/" + sessionId);
    });

    stream.on("error", (err) => {
        // show error
        console.log("stream.error", err);
    });

    stream.on("end", () => {
        // show error
        console.log("stream.end");
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

export const setSettings = (token: string, sessionId: string, alias?: string, captain?: boolean, teamId?: string): AppThunk => dispatch => {
    const req = new SetSettingsRequest();
    req.setToken(token)
    req.setSessionid(sessionId);
    if (alias) {
        req.setAlias(alias);
    }
    if (captain) {
        req.setCaptain(captain);
    }
    if (teamId) {
        req.setTeamid(teamId);
    }
    client.setSettings(req, null, (err: Error, response: Empty) => {
    });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const sessionNumOfColumns = (state: RootState) => state.gameState.numOfColumns;
export const sessionCells = (state: RootState) => state.gameState.cells;
export const sessionTeams = (state: RootState) => state.gameState.teams;
export const sessionPlayers = (state: RootState) => state.gameState.players;
export const sessionStarted = (state: RootState) => state.gameState.started;
export const sessionMe = (state: RootState) => state.gameState.me;
export const sessionStreamStatus = (state: RootState) => state.gameState.streamStatus;
export const playerToken = (state: RootState) => state.gameState.token;
export const sessionConnected = (state: RootState) => state.gameState.connected;

export default gameStateSlice.reducer;
