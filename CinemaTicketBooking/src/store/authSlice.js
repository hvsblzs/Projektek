import { createSlice } from '@reduxjs/toolkit';

const tokenFromStorage = localStorage.getItem('token') || null;

const initialState = {
    user: null,
    token: tokenFromStorage,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
