import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import gameStateReducer from './gameStateSlice';

export const store = configureStore({
    reducer: {
        gameState: gameStateReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
