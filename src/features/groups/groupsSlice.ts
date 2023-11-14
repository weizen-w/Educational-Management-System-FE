import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import GroupsState from './types/GroupsState';
import * as api from './api';
import Group from './types/Group';

const initialState: GroupsState = {
	groups: [],
	error: undefined,
};

export const loadGroups = createAsyncThunk('groups/loadGroups', () => api.getAll());

export const loadGroupsByAuthUser = createAsyncThunk('groups/loadGroupsByAuthUser', () =>
	api.getGroupsByAuthUser()
);

export const loadMainGroupsByAuthUser = createAsyncThunk('groups/loadMainGroupsByAuthUser', () =>
	api.getMainGroupsByAuthUser()
);

export const updateGroup = createAsyncThunk('groups/updateGroup', async (group: Group) =>
	api.updateGroup(group.id, group)
);

export const createGroup = createAsyncThunk('groups/createGroup', async (group: Group) =>
	api.addGroup(group)
);

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
			})
			.addCase(loadGroupsByAuthUser.fulfilled, (state, action) => {
				state.groups = action.payload;
			})
			.addCase(loadGroupsByAuthUser.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(loadMainGroupsByAuthUser.fulfilled, (state, action) => {
				state.group = action.payload;
			})
			.addCase(loadMainGroupsByAuthUser.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateGroup.fulfilled, (state, action) => {
				state.groups = state.groups.map((group) =>
					group.id === action.payload.id ? action.payload : group
				);
			})
			.addCase(updateGroup.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(createGroup.fulfilled, (state, action) => {
				state.groups.push(action.payload);
			})
			.addCase(createGroup.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetGroupError: resetGroupError } = groupsSlice.actions;

export default groupsSlice.reducer;
