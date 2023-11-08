import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Module from './types/Module';
import * as api from './api';
import ModuleState from './types/ModuleState';

const initialState: ModuleState = {
	modules: [],
	error: undefined,
};

export const loadModules = createAsyncThunk('modules/loadModules', () => api.getAllModules());

export const updateModule = createAsyncThunk('modules/updateModule', async (module: Module) =>
	api.updateModule(module.id, module)
);

export const createModule = createAsyncThunk('modules/createModule', async (moduleName: string) =>
	api.createModule(moduleName)
);

const modulesSlice = createSlice({
	name: 'modules',
	initialState,
	reducers: {
		resetModuleError: (state): void => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadModules.fulfilled, (state, action) => {
				state.modules = action.payload;
			})
			.addCase(loadModules.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateModule.fulfilled, (state, action) => {
				state.modules = state.modules.map((module) =>
					module.id === action.payload.id ? action.payload : module
				);
			})
			.addCase(updateModule.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(createModule.fulfilled, (state, action) => {
				state.modules.push(action.payload);
			})
			.addCase(createModule.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetModuleError } = modulesSlice.actions;

export default modulesSlice.reducer;
