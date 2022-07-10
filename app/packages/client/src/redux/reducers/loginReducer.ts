import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import {UserType} from "@elr0berto/robert-learns-shared/src/types/UserType"

enum StatusEnum {
    initial,
    checking,
    loggingIn,
    error,
    loggedIn
}
// Define a type for the slice state
interface LoginState {
    loggedInUser: UserType | null;
    status : StatusEnum;
}

// Define the initial state using that type
const initialState: LoginState = {
    loggedInUser: null,
    status: StatusEnum.initial,
}

export const loginSlice = createSlice({
    name: 'login',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
    },
})

export const { } = loginSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLoggedInUser = (state: RootState) => state.login.loggedInUser;
export const selectStatus = (state: RootState) => state.login.status;

export default loginSlice.reducer