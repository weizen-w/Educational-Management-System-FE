import { RootState } from '../../app/store';
import Comment from './types/Comment';

export const selectComments = (state: RootState): Comment[] => state.comments.comments;
export const selectCommentError = (state: RootState): string | undefined => state.comments.error;
