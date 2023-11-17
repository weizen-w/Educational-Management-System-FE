import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import MaterialsState from './types/MaterialsState';
import * as api from './api';

const initialState: MaterialsState = {
	materials: [],
	error: undefined,
};

export const loadMaterials = createAsyncThunk('materials/loadMaterials', async (groupId: number) =>
	api.getAll(groupId)
);

const materialsSlice = createSlice({
	name: 'materials',
	initialState,
	reducers: {
		resetMaterialError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadMaterials.fulfilled, (state, action) => {
				state.materials = action.payload;
			})
			.addCase(loadMaterials.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetMaterialError: resetMaterialError } = materialsSlice.actions;

export default materialsSlice.reducer;
