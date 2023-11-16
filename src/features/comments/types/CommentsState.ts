import Comment from './Comment';

export default interface CommentsState {
	comments: Comment[];
	error?: string;
}
