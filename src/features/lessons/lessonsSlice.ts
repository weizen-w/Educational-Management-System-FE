import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import LessonsState from './types/LessonsState';
import * as api from './api';
import Lesson from './types/Lesson';

const initialState: LessonsState = {
	lessons: [],
	error: undefined,
};

export const loadLessons = createAsyncThunk('lessons/loadLessons', async (id: number) =>
	api.getAllbyGroup(id)
);

export const updateLessons = createAsyncThunk('lessons/updateLessons', async (lesson: Lesson) => {
	// TODO groupId by LessonDto (Backend)
	const updatedLesson = await api.updateLesson(lesson.groupId, lesson);
	return updatedLesson;
});

export const createLessons = createAsyncThunk('lessons/createLessons', async (lesson: Lesson) => {
	// TODO groupId by LessonDto (Backend)
	const createLesson = await api.addLesson(lesson.groupId, lesson);
	return createLesson;
});

const lessonsSlice = createSlice({
	name: 'lessons',
	initialState,
	reducers: {
		resetLessonError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadLessons.fulfilled, (state, action) => {
				state.lessons = action.payload;
			})
			.addCase(loadLessons.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateLessons.fulfilled, (state, action) => {
				state.lessons = state.lessons.map((lesson) =>
					lesson.lessonId === action.payload.lessonId ? action.payload : lesson
				);
			})
			.addCase(updateLessons.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(createLessons.fulfilled, (state, action) => {
				state.lessons.push(action.payload);
			})
			.addCase(createLessons.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetLessonError: resetLessonError } = lessonsSlice.actions;

export default lessonsSlice.reducer;
