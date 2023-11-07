import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UsersState from './types/UsersState';
import * as api from './api';
import User from './types/User';

const initialState: UsersState = {
	users: [],
};

export const loadUsers = createAsyncThunk('users/loadUsers', () => api.getAll());
export const updateUser = createAsyncThunk('users/updateUsers', (user: User) =>
	api.updateUser(user)
);
export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadUsers.fulfilled, (state, action) => {
				state.users = action.payload;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.users = state.users.map((u) => (u.id === action.payload.id ? action.payload : u));
			});
	},
});

export default usersSlice.reducer;
