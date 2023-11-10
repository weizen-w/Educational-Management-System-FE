import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from './api';
import User from '../auth/types/User';
import UsersState from './types/UsersState';

const initialState: UsersState = {
	users: [],
	error: undefined,
};

export const loadUsers = createAsyncThunk('users/loadUsers', () => api.getAll());

export const updateUser = createAsyncThunk('users/updateUsers', (user: User) =>
	api.updateUser(user.id, user)
);

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		resetUserError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadUsers.fulfilled, (state, action) => {
				state.users = action.payload;
			})
			.addCase(loadUsers.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.users = state.users.map((u) => (u.id === action.payload.id ? action.payload : u));
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetUserError: resetUserError } = usersSlice.actions;

export default usersSlice.reducer;
