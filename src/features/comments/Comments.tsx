import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Submission from '../submissions/types/Submisson';
import { selectComments } from './selectors';
import Comment from './types/Comment';
import { createComment, loadCommentsBySubmission, resetCommentError } from './commentsSlice';
import { selectUsers } from '../users/selectors';
import User from '../auth/types/User';
import { loadUsers } from '../users/usersSlice';

interface Props {
	submission: Submission;
}

export default function Comments(props: Props): JSX.Element {
	const { submission } = props;
	const dispatch = useAppDispatch();
	const users = useAppSelector(selectUsers);
	const comments = useAppSelector(selectComments);
	const [newComment, setNewComment] = useState<Comment>({
		comment_id: 0,
		submission_id: submission.submission_id,
		author_id: 0,
		messageText: '',
		messageDate: '',
		archived: false,
	});
	const [errorsObj, setErrorsObj] = useState({
		comment_idError: '',
		submission_idError: '',
		author_idError: '',
		messageTextError: '',
		messageDateError: '',
		archivedError: '',
	});

	const getAuthor = (findId: number): User | undefined => {
		const u = users.find((u) => u.id === findId);
		return u;
	};

	const handleSubmitSend = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			let hasError = false;
			setErrorsObj({
				comment_idError: '',
				submission_idError: '',
				author_idError: '',
				messageTextError: '',
				messageDateError: '',
				archivedError: '',
			});

			// eslint-disable-next-line @typescript-eslint/naming-convention
			const { messageText } = newComment;
			if (!messageText.trim()) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					messageTextError: 'The comment cannot be empty or only spaces',
				}));
				hasError = true;
			}
			if (hasError) {
				return;
			}

			try {
				await dispatch(createComment(newComment));
				setErrorsObj({
					comment_idError: '',
					submission_idError: '',
					author_idError: '',
					messageTextError: '',
					messageDateError: '',
					archivedError: '',
				});
				setNewComment({
					comment_id: 0,
					submission_id: submission.submission_id,
					author_id: 0,
					messageText: '',
					messageDate: '',
					archived: false,
				});
				dispatch(loadCommentsBySubmission(submission.submission_id));
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, newComment]
	);

	const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		dispatch(resetCommentError());
		setNewComment((prevNewComment) => ({
			...prevNewComment,
			messageText: e.target.value,
		}));
	};

	useEffect(() => {
		dispatch(loadCommentsBySubmission(submission.submission_id));
		dispatch(loadUsers());
	}, [dispatch, newComment]);

	return (
		<>
			<div className="list-group" style={{ backgroundColor: '#BEBEBE', padding: '10px' }}>
				{comments
					.toSorted((a, b) => new Date(a.messageDate).getTime() - new Date(b.messageDate).getTime())
					.map((comment) => (
						<a
							key={comment.comment_id}
							className="list-group-item list-group-item-action"
							aria-current="true"
						>
							<div style={{ marginBottom: '10px', borderBottom: '1px solid black' }}>
								<small>
									<b>
										{getAuthor(comment.author_id)?.firstName}{' '}
										{getAuthor(comment.author_id)?.lastName}
									</b>
								</small>
								<small>({new Date(comment.messageDate).toString()})</small>
							</div>
							<h5 className="mb-1">{comment.messageText}</h5>
						</a>
					))}
			</div>
			<div>
				<hr style={{ borderColor: 'black', borderWidth: '2px' }} />
				<form className="auth-form row g-1" onSubmit={handleSubmitSend}>
					{errorsObj.messageTextError && (
						<div className="invalid-feedback mb-3" style={{ display: 'block' }}>
							{errorsObj.messageTextError}
						</div>
					)}
					<div className="mb-3">
						<textarea
							className="form-control"
							id="exampleFormControlTextarea1"
							rows={3}
							value={newComment.messageText}
							onChange={handleChangeMessage}
							placeholder={'Comment...'}
						></textarea>
					</div>
					<div className="col-md-1 row g-1">
						<button type="submit" className="btn btn-primary">
							Send
						</button>
					</div>
				</form>
			</div>
		</>
	);
}
