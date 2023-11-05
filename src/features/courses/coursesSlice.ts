import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CoursesState from './types/CoursesState';
import * as api from './api';
import Course from './types/Course';

const initialState: CoursesState = {
	courses: [],
	error: undefined,
};

export const loadCourses = createAsyncThunk('courses/loadCourses', () => api.getAll());

export const updateCourse = createAsyncThunk('courses/updateCourse', async (course: Course) =>
	api.updateCourse(course.id, course)
);

const coursesSlice = createSlice({
	name: 'courses',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadCourses.fulfilled, (state, action) => {
				state.courses = action.payload;
			})
			.addCase(updateCourse.fulfilled, (state, action) => {
				state.courses = state.courses.map((course) =>
					course.id === action.payload.id ? action.payload : course
				);
			});
	},
});

export default coursesSlice.reducer;
