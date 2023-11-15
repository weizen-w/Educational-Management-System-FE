import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SubmissionsState from './types/SubmissionsState';
import * as api from './api';
import Submission from './types/Submisson';

const initialState: SubmissionsState = {
	submissions: [],
	submission: {
		submission_id: 0,
		description: '',
		lesson_id: 0,
		student_id: 0,
		submission_state: '',
		archived: false,
	},
	error: undefined,
};

export const loadSubmissionsByUser = createAsyncThunk(
	'submissions/loadSubmissionsByUser',
	async (userId: number) => api.getAllByUser(userId)
);

export const loadSubmissionsByLesson = createAsyncThunk(
	'submissions/loadSubmissionsByLesson',
	async (lessonId: number) => api.getAllByLesson(lessonId)
);

export const createSubmissionByLesson = createAsyncThunk(
	'submissions/createSubmissionByLesson',
	async (submission: { lessonId: number; description: string }) =>
		api.createSubmission(submission.lessonId, submission.description)
);

export const updateSubmission = createAsyncThunk(
	'submissions/updateSubmission',
	async (submission: Submission) => api.updateSubmission(submission.submission_id, submission)
);

const submissionsSlice = createSlice({
	name: 'submissions',
	initialState,
	reducers: {
		resetSubmissionError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadSubmissionsByUser.fulfilled, (state, action) => {
				state.submissions = action.payload;
			})
			.addCase(loadSubmissionsByUser.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(loadSubmissionsByLesson.fulfilled, (state, action) => {
				state.submissions = action.payload;
			})
			.addCase(loadSubmissionsByLesson.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(createSubmissionByLesson.fulfilled, (state, action) => {
				state.submission = action.payload;
			})
			.addCase(createSubmissionByLesson.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateSubmission.fulfilled, (state, action) => {
				state.submissions = state.submissions.map((submission) =>
					submission.submission_id === action.payload.submission_id ? action.payload : submission
				);
			})
			.addCase(updateSubmission.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetSubmissionError: resetSubmissionError } = submissionsSlice.actions;

export default submissionsSlice.reducer;
