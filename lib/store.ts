import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";

export type AlertType = "High" | "Low" | "Last";

export interface Alert {
  id: string;
  commodity: string;
  priceType: AlertType;
  targetValue: number;
}

interface AlertsState {
  alerts: Alert[];
}

const initialState: AlertsState = {
  alerts: [],
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert(state: AlertsState, action: PayloadAction<Alert>) {
      state.alerts.push(action.payload);
    },
    removeAlert(state: AlertsState, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter(
        (alert: Alert) => alert.id !== action.payload
      );
    },
    updateAlert(state: AlertsState, action: PayloadAction<Alert>) {
      const idx = state.alerts.findIndex(
        (a: Alert) => a.id === action.payload.id
      );
      if (idx !== -1) state.alerts[idx] = action.payload;
    },
  },
});

export const { addAlert, removeAlert, updateAlert } = alertsSlice.actions;

const rootReducer = combineReducers({
  alerts: alertsSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage as any,
  whitelist: ["alerts"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
