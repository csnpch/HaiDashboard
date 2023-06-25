import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './../'
import { DataUserObjectInterface } from '@/interfaces/api/user'



interface UserInterface {
    dataUser: DataUserObjectInterface|null,
}


const initialState: UserInterface = {
    dataUser: null,
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setDataUser: (state, action: PayloadAction<UserInterface>) => {
            state.dataUser = action.payload.dataUser
        },
        updateDataUser: (state, action: PayloadAction<{
            key: keyof DataUserObjectInterface,
            value: DataUserObjectInterface[keyof DataUserObjectInterface]
        }>) => {
            if (!state.dataUser) return

            const { key, value } = action.payload
            state.dataUser = {
                ...state.dataUser,
                [key]: value
            }
        }
    },
})


export const getDataUser = (state: RootState): 
    DataUserObjectInterface|null => state.user.dataUser

export const {
    setDataUser,
} = authSlice.actions

export default authSlice.reducer