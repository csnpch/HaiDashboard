import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '..'
import { IMapModel } from '@/interfaces/api/dashboard'


interface MapInterface {
    dataMap: IMapModel[]
}


const initialState: MapInterface = {
    dataMap: [],
}


export const mapSlice = createSlice({
    name: 'Map',
    initialState,
    reducers: {
        setDataMap: (state, action: PayloadAction<IMapModel[]>) => {
            state.dataMap = action.payload
        },
    },
})


export const getDataMap = (state: RootState):
    MapInterface['dataMap'] => state.map.dataMap


export const {
    setDataMap,
} = mapSlice.actions

export default mapSlice.reducer