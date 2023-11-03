import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UsersState from './types/UsersState';
import * as api from './api';

const initialState: UsersState = {
	users: [],
};

export const loadUsers = createAsyncThunk('users/loadUsers', () => api.getAll());
export const updateUser = createAsyncThunk('users/updateUsers', (id: number) => api.updateUser(id));
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
				state = {
					...state,
					users: state.users.filter((user) => user.id !== action.payload.id),
				};
			});
	},
});
export default usersSlice.reducer;
