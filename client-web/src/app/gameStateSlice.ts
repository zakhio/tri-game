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

interface GameState {
    sessionId: string | null;
    token: string;
    connected: boolean;
    me?: string | null;
    players: Player.AsObject[];
    teams: Team.AsObject[];
    cells: Cell.AsObject[];
    numOfColumns: number;
}

const initialState: GameState = {
    sessionId: null,
    token: v4(),
    connected: false,
    me: null,
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
        replaceCurrentState: (state, action: PayloadAction<GameSessionStream.AsObject>) => {
            state.cells = action.payload.cellsList
            state.numOfColumns = action.payload.numberofcolumns;
            state.players = action.payload.playersList
            state.teams = action.payload.teamsList
            state.me = action.payload.playerid
        },
        resetCurrentState: (state, action: PayloadAction<void>) => {
            state.cells = []
            state.teams = []
            state.players = []
            state.me = null
            state.connected = false
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        replaceCurrentSession: (state, action: PayloadAction<string>) => {
            state.sessionId = action.payload;
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
export const joinAsync = (token: string, sessionId: string): AppThunk => dispatch => {
    if (stream) {
        stream.cancel();
    }

    localStorage.setItem("sessionId", sessionId);
    localStorage.setItem("token", token);

    const observerReq = new ObserveSessionRequest();
    observerReq.setSessionid(sessionId);
    observerReq.setToken(token);

    stream = client.observeSession(observerReq);
    stream.on('data', (res) => {
        console.log("stream.data", res.toObject());
        dispatch(replaceConnected(true));
        dispatch(replaceCurrentState(res.toObject()));
    });

    stream.on("error", (err) => {
        console.log("stream.error", err);
    });

    stream.on("end", () => {
        console.log("stream.end");
    });
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const createSession = (token: string): AppThunk => dispatch => {
    const req = new CreateSessionRequest();
    req.setToken(token);

    client.createSession(req, null, (err: Error, res: CreateSessionReply) => {
        if (err) {
            console.log(err);
            return;
        }
        const sessionId: string = res.getSessionid();
        dispatch(replaceCurrentSession(sessionId))
        dispatch(joinAsync(token, sessionId))
    });
};

export const checkCurrentSession = (): AppThunk => dispatch => {
    const sessionId = localStorage.getItem("sessionId");
    const token = localStorage.getItem("token");

    if (token && sessionId) {
        dispatch(replaceCurrentSession(sessionId))
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

export const setSettings = (token: string, sessionId: string, alias: string, captain: boolean, teamId: string): AppThunk => dispatch => {
    const req = new SetSettingsRequest();
    req.setToken(token)
    req.setSessionid(sessionId);
    req.setAlias(alias);
    req.setCaptain(captain);
    req.setTeamid(teamId);
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
export const sessionMe = (state: RootState) => state.gameState.me;
export const playerSessionId = (state: RootState) => state.gameState.sessionId;
export const playerToken = (state: RootState) => state.gameState.token;
export const sessionConnected = (state: RootState) => state.gameState.connected;

export default gameStateSlice.reducer;
