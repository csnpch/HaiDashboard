import { configureStore } from '@reduxjs/toolkit'
import navbarReducer from './slices/navbarSlice'
import userReducer from './slices/userSlice'
import sidebarReducer from './slices/sidebarSlice'
import mapSlice from './slices/mapSlice'


export const store = configureStore({
  reducer: {
    map: mapSlice,
    navbar: navbarReducer,
    user: userReducer,
    sidebar: sidebarReducer,
  },
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch