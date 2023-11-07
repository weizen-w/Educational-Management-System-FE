import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import GroupsState from './types/GroupsState';
import * as api from './api';

const initialState: GroupsState = {
	groups: [],
	error: undefined,
};

export const loadGroups = createAsyncThunk('groups/loadGroups', () => api.getAll());

const groupsSlice = createSlice({
	name: 'groups',
	initialState,
	reducers: {
		resetGroupError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadGroups.fulfilled, (state, action) => {
				state.groups = action.payload;
			})
			.addCase(loadGroups.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetGroupError: resetGroupError } = groupsSlice.actions;

export default groupsSlice.reducer;
