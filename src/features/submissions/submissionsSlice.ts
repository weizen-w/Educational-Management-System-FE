import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SubmissionsState from './types/SubmissionsState';
import * as api from './api';
import Submission from './types/Submisson';

const initialState: SubmissionsState = {
	submissions: [],
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
