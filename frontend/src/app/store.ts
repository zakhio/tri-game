import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import gameStateReducer from './gameStateSlice';
import {useDispatch} from "react-redux";

export const store = configureStore({
    reducer: {
        gameState: gameStateReducer,
    },
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
