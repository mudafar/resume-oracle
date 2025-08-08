import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import profileSectionsReducer from "./slices/profileSectionsSlice";
import jobContextReducer from "./slices/jobDescriptionSlice";
import matchesReducer from "./slices/matchesSlice";
import resumeSectionsReducer from "./slices/resumeSectionsSlice";
import resumeReducer from "./slices/resumeSlice";
import coverLetterReducer from "./slices/coverLetterSlice";
import llmConfigReducer from "./slices/llmConfigSlice";
import stepReducer from "./slices/stepSlice";
import signaturesReducer from "./slices/signaturesSlice";

const rootReducer = combineReducers({
  profileSections: profileSectionsReducer,
  jobContext: jobContextReducer,
  matches: matchesReducer,
  resumeSections: resumeSectionsReducer,
  resume: resumeReducer,
  coverLetter: coverLetterReducer,
  llmConfig: llmConfigReducer,
  step: stepReducer,
  signatures: signaturesReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;