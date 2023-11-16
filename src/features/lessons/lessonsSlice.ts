import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import LessonsState from './types/LessonsState';
import * as api from './api';
import LessonDto from './types/LessonDto';

const initialState: LessonsState = {
	lessons: [],
	lesson: {
		lessonId: 0,
		group: {
			id: 0,
			name: '',
			courseId: 0,
			archived: false,
		},
		lessonTitle: '',
		lessonDescription: '',
		lessonType: '',
		teacher: {
			id: 0,
			password: '',
			firstName: '',
			lastName: '',
			email: '',
			role: '',
			state: '',
			photoLink: '',
		},
		lessonDate: '',
		startTime: '',
		endTime: '',
		module: {
			id: 0,
			name: '',
			archived: false,
		},
		linkLms: '',
		linkZoom: '',
		archived: false,
	},
	error: undefined,
};

export const loadLessons = createAsyncThunk('lessons/loadLessons', async (id: number) =>
	api.getAllbyGroup(id)
);

export const loadLessonsByTeacher = createAsyncThunk('lessons/loadLessonsByTeacher', () =>
	api.getAllbyTeacher()
);

export const loadLesson = createAsyncThunk('lessons/loadLesson', (lessonId: number) =>
	api.getLesson(lessonId)
);

export const updateLesson = createAsyncThunk('lessons/updateLessons', async (lesson: LessonDto) => {
	// TODO groupId by LessonDto (Backend)
	const upLesson = await api.updateLesson(lesson.lessonId, lesson);
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
			.addCase(loadLessonsByTeacher.fulfilled, (state, action) => {
				state.lessons = action.payload;
			})
			.addCase(loadLessonsByTeacher.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(loadLesson.fulfilled, (state, action) => {
				state.lesson = action.payload;
			})
			.addCase(loadLesson.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateLesson.fulfilled, (state, action) => {
				state.lessons = state.lessons.map((lesson) =>
					lesson.lessonId === action.payload.lessonId ? action.payload : lesson
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
