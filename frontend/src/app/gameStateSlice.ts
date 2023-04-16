import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';
import { hostUrl } from "./config";
import { NavigateFunction } from "react-router-dom";

import { Stomp } from "@stomp/stompjs";
import { Api, ChangeConfigDTO, SessionDTO, PlayerDTO, ChangePlayerDTO, FieldCellDTO, ChangeFieldCellDTO } from "../api/rest";

export enum StreamStatus {
  Idle = 1,
  Connecting,
  Connected,
  Failed,
}

export enum StatusCode {
  UNAVAILABLE,
  NOT_FOUND,
  UNKNOWN
}

export interface Status {
  code: StatusCode
}

interface GameState {
  streamStatus: StreamStatus;
  notFound: boolean;
  serverUnavailable: boolean;

  me?: PlayerDTO
  session: SessionDTO | null
}

const initialState: GameState = {
  streamStatus: StreamStatus.Idle,
  notFound: false,
  serverUnavailable: false,
  session: null,
};

const rest_client = new Api({
  baseUrl: hostUrl(),
  baseApiParams: { format: "json", credentials: "include" }
});

let game_socket_client = Stomp.client("ws://localhost:8080/socket/sessions");
game_socket_client.activate()

export const gameStateSlice = createSlice({
  name: 'gameState',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    replaceGameState: (state, action: PayloadAction<SessionDTO>) => {
      console.log("replaceGameState", action)
      state.session = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    replaceStreamStatus: (state, action: PayloadAction<StreamStatus>) => {
      console.log("replaceStreamStatus", action)
      state.streamStatus = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    replaceMe: (state, action: PayloadAction<PlayerDTO>) => {
      state.me = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    replaceConnectionStatus: (state, action: PayloadAction<Status | null>) => {
      console.log("replaceConnectionStatus", action)
      let status = action.payload;

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

export const {
  replaceGameState,
  replaceMe,
  replaceStreamStatus,
  replaceConnectionStatus
} = gameStateSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const updateSession = (token: string, sessionId: string): AppThunk => dispatch => {
  localStorage.setItem("token", token);
  rest_client.sessions.getSession(sessionId).then(r => {
    console.log('getSession', r.data);
    dispatch(replaceGameState(r.data));
    dispatch(subscribeOnUpdates(token, sessionId))
  }).catch(err => {
    console.log("get session err", err)
  })
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const subscribeOnUpdates = (token: string, sessionId: string): AppThunk => dispatch => {
  // if (game_socket_client) {
  //     game_socket_client.disconnect();
  // }

  game_socket_client.subscribe(`/session/${sessionId}`, message => {
    console.log("subscribe", message)
    dispatch(replaceStreamStatus(StreamStatus.Connected));
  })
  // stream = game_session_client.observeSession(observerReq);
  // dispatch(replaceStreamStatus(StreamStatus.Connecting));
  // stream.on('status', (status: Status) => {
  //     console.log('status', status);
  //     dispatch(replaceConnectionStatus(status));
  // });
  //
  // stream.on('data', (res) => {
  //     if (navigate) {
  //         navigate("/" + sessionId);
  //     }
  //
  //     dispatch(replaceGameState(res.toObject()));
  //     dispatch(replaceStreamStatus(StreamStatus.Connected));
  // });
  //
  // stream.on("end", () => {
  //     console.log('end')
  //     dispatch(replaceStreamStatus(StreamStatus.Idle));
  // });
};


// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const createSession = (token: string, navigate: NavigateFunction): AppThunk => dispatch => {
  rest_client.sessions.newSession().then(resp => {
    const sessionId: string = resp.data.id!;
    navigate("/" + sessionId);
    dispatch(replaceConnectionStatus(null))
  }).catch(reason => {
    console.log(reason);
    return;
  });
};

export const joinSession = (token: string, sessionId: string): AppThunk => (dispatch, getState) => {
  if (getState().gameState.session !== null || getState().gameState.streamStatus === StreamStatus.Connecting) {
    return;
  }

  dispatch(replaceStreamStatus(StreamStatus.Connecting));
  dispatch(getMe())
  dispatch(updateSession(token, sessionId))
  setTimeout(() => dispatch(subscribeOnUpdates(token, sessionId)), 1000)
};

export const startGame = (token: string, sessionId: string, language?: string): AppThunk => dispatch => {
  const body: ChangeConfigDTO = {
    columnCount: 5,
    rowsCount: 5,
    teamsCount: 2,
    language: language
  };

  rest_client.sessions.changeConfig(sessionId, body).then(resp => {
    console.log(resp)
    rest_client.sessions.changeState(sessionId, { state: 'IN_PROGRESS' }).then(resp => {
      console.log(resp)
      dispatch(updateSession(token, sessionId))
    }).catch(reason => {
      console.log(reason);
      return;
    });
  }).catch(reason => {
    console.log(reason);
    return;
  });
};

export const getMe = (): AppThunk => dispatch => {
  rest_client.users.getMe().then(resp => {
    console.log("me", resp);
    dispatch(replaceMe(resp.data));
  }).catch(reason => {
    console.log(reason);
    return;
  });
};

export const turn = (token: string, sessionId: string, cellIndex: number): AppThunk => dispatch => {
  const body: ChangeFieldCellDTO = {
    open: true
  }

  rest_client.sessions.changeCell(sessionId, cellIndex, body).then(resp => {
    console.log("changeCell", resp)
    dispatch(updateSession(token, sessionId))
  }).catch(reason => {
    console.log("[catch] changeCell", reason);
    return;
  });
};

export const setSettings = (token: string, sessionId: string, captain: boolean): AppThunk => (dispatch, getState) => {
  const body: ChangePlayerDTO = {
    name: "",
    captain: captain,
    teamID: 0
  }

  rest_client.sessions.changePlayer(sessionId, getState().gameState.me?.id!, body).then(resp => {
    console.log(resp)
    dispatch(updateSession(token, sessionId))
  }).catch(reason => {
    console.log(reason);
    return;
  });
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const gameNumOfColumns = (state: RootState) => state.gameState.session?.config?.columnCount ?? 0;
export const gameCells = (state: RootState) => state.gameState.session?.cells ?? [];
export const gameTeams = (state: RootState) => state.gameState.session?.players;
export const gamePlayers = (state: RootState) => state.gameState.session?.players;
export const gameLanguage = (state: RootState) => state.gameState.session?.config?.language;
export const gameInProgress = (state: RootState) => state.gameState.session?.state === "IN_PROGRESS";
export const gameMe = (state: RootState) => state.gameState.me;
export const isPlayerInGame = (state: RootState) => state.gameState.session?.playerIDtoTeamID[state.gameState.me?.id || ""] !== undefined;
export const isPlayerCaptain = (state: RootState) => state.gameState.session?.captains.indexOf(state.gameState.me?.id || "") !== -1;
export const playerToken = (state: RootState) => "";
export const gameSession = (state: RootState) => state.gameState.session;
export const sessionNotFound = (state: RootState) => state.gameState.notFound;

export default gameStateSlice.reducer;
