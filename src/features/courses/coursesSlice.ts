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

export const createCourse = createAsyncThunk('courses/createCourse', async (courseName: string) =>
	api.addCourse(courseName)
);

const coursesSlice = createSlice({
	name: 'courses',
	initialState,
	reducers: {
		resetError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadCourses.fulfilled, (state, action) => {
				state.courses = action.payload;
			})
			.addCase(loadCourses.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateCourse.fulfilled, (state, action) => {
				state.courses = state.courses.map((course) =>
					course.id === action.payload.id ? action.payload : course
				);
			})
			.addCase(updateCourse.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(createCourse.fulfilled, (state, action) => {
				state.courses.push(action.payload);
			})
			.addCase(createCourse.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetError } = coursesSlice.actions;

export default coursesSlice.reducer;
