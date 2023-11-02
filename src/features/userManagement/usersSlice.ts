import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UsersState from './types/UsersState';
import * as api from './api';
import { user } from '../auth/api';

const initialState: UsersState = {
	users: [],
};

export const loadUsers = createAsyncThunk('users/loadUsers', () => api.getAll());
const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(loadUsers.fulfilled, (state, action) => {
			state.users = action.payload;
		});
	},
});
export default usersSlice.reducer;
