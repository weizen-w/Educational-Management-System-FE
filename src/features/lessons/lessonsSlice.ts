import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import LessonsState from './types/LessonsState';
import * as api from './api';
import LessonDto from './types/LessonDto';

const initialState: LessonsState = {
	lessons: [],
	error: undefined,
};

export const loadLessons = createAsyncThunk('lessons/loadLessons', async (id: number) =>
	api.getAllbyGroup(id)
);

export const updateLesson = createAsyncThunk('lessons/updateLessons', async (lesson: LessonDto) => {
	// TODO groupId by LessonDto (Backend)
	const upLesson = await api.updateLesson(lesson.groupId, lesson);
	return upLesson;
});

export const createLesson = createAsyncThunk('lessons/createLessons', async (lesson: LessonDto) => {
	// TODO groupId by LessonDto (Backend)
	const crLesson = await api.addLesson(lesson.groupId, lesson);
	return crLesson;
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
			.addCase(updateLesson.fulfilled, (state, action) => {
				state.lessons = state.lessons.map((lesson) =>
					lesson.id === action.payload.id ? action.payload : lesson
				);
			})
			.addCase(updateLesson.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(createLesson.fulfilled, (state, action) => {
				state.lessons.push(action.payload);
			})
			.addCase(createLesson.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetLessonError: resetLessonError } = lessonsSlice.actions;

export default lessonsSlice.reducer;