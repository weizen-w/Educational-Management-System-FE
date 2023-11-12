import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CommentsState from './types/CommentsState';
import * as api from './api';
import Comment from './types/Comment';

const initialState: CommentsState = {
	comments: [],
	error: undefined,
};

export const loadCommentsBySubmission = createAsyncThunk(
	'comments/loadCommentsBySubmission',
	async (submissionId: number) => api.getAllBySubmission(submissionId)
);

export const createComment = createAsyncThunk('comments/createComment', async (comment: Comment) =>
	api.createComment(comment.messageText, comment.submission_id)
);

export const updateComment = createAsyncThunk('comments/updateComment', async (comment: Comment) =>
	api.updateComment(comment.comment_id, comment)
);

export const deleteComment = createAsyncThunk('comments/deleteComment', async (commentId: number) =>
	api.deleteComment(commentId)
);

const commentsSlice = createSlice({
	name: 'comments',
	initialState,
	reducers: {
		resetCommentError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadCommentsBySubmission.fulfilled, (state, action) => {
				state.comments = action.payload;
			})
			.addCase(loadCommentsBySubmission.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(createComment.fulfilled, (state, action) => {
				state.comments.push(action.payload);
			})
			.addCase(createComment.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(updateComment.fulfilled, (state, action) => {
				state.comments = state.comments.map((comment) =>
					comment.comment_id === action.payload.comment_id ? action.payload : comment
				);
			})
			.addCase(updateComment.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(deleteComment.fulfilled, (state, action) => {
				state.comments = state.comments.filter(
					(comment) => comment.comment_id !== action.payload.comment_id
				);
			})
			.addCase(deleteComment.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export const { resetCommentError: resetCommentError } = commentsSlice.actions;

export default commentsSlice.reducer;
