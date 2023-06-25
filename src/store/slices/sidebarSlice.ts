import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '..'


interface SidebarInterface {
    stateToggleSidebar: boolean,
}


const initialState: SidebarInterface = {
    stateToggleSidebar: false,
}


export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        toggleStateSidebar: (state) => {
            state.stateToggleSidebar = !state.stateToggleSidebar
        },
    },
})


export const getStateSidebar = (state: RootState):
    SidebarInterface['stateToggleSidebar'] => state.sidebar.stateToggleSidebar


export const {
    toggleStateSidebar,
} = sidebarSlice.actions

export default sidebarSlice.reducer