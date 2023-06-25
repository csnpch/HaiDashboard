import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '..'


interface NavbarInterface {
    currentIndexMenu: number,
    currentIndexFilterRegional: number,
    currentIndexFilterRegionalHealth: number,
    currentIndexIndicator: number,
}


const initialState: NavbarInterface = {
    currentIndexMenu: 0,
    currentIndexFilterRegional: 0,
    currentIndexFilterRegionalHealth: 0,
    currentIndexIndicator: 0,
}


export const sidebarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        setCurrentIndexMenu: (state, action: PayloadAction<{
            index: NavbarInterface['currentIndexMenu']
        }>) => {
            state.currentIndexMenu = action.payload.index
        },
        setCurrentIndexFilterRegional: (state, action: PayloadAction<{
            index: NavbarInterface['currentIndexFilterRegional']
        }>) => {
            state.currentIndexFilterRegional = action.payload.index
        },
        setCurrentIndexFilterRegionalHealth: (state, action: PayloadAction<{
            index: NavbarInterface['currentIndexFilterRegionalHealth']
        }>) => {
            state.currentIndexFilterRegionalHealth = action.payload.index
        },
        setCurrentIndexIndicator: (state, action: PayloadAction<{
            index: NavbarInterface['currentIndexFilterRegional']
        }>) => {
            state.currentIndexIndicator = action.payload.index
        }
    },
})


export const getCurrentIndexMenu = (state: RootState): 
    NavbarInterface['currentIndexMenu'] => state.navbar.currentIndexMenu

export const getCurrentIndexFilterRegional = (state: RootState):
    NavbarInterface['currentIndexFilterRegional'] => state.navbar.currentIndexFilterRegional

export const getCurrentIndexFilterRegionalHealth = (state: RootState):
    NavbarInterface['currentIndexFilterRegionalHealth'] => state.navbar.currentIndexFilterRegionalHealth

export const getCurrentIndexIndicator = (state: RootState):
    NavbarInterface['currentIndexFilterRegional'] => state.navbar.currentIndexIndicator


export const {
    setCurrentIndexMenu,
    setCurrentIndexFilterRegional,
    setCurrentIndexFilterRegionalHealth,
    setCurrentIndexIndicator,
} = sidebarSlice.actions

export default sidebarSlice.reducer