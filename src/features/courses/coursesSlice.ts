import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CoursesState from './types/CoursesState';
import * as api from './api';

const initialState: CoursesState = {
	courses: [],
	error: undefined,
};

export const loadCourses = createAsyncThunk('courses/loadCourses', () => api.getAll());

const coursesSlice = createSlice({
	name: 'courses',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(loadCourses.fulfilled, (state, action) => {
			state.courses = action.payload;
		});
	},
});

export default coursesSlice.reducer;
