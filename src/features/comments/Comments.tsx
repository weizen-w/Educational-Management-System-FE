import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Submission from '../submissions/types/Submisson';
import { selectComments } from './selectors';
import Comment from './types/Comment';
import {
	createComment,
	deleteComment,
	loadCommentsBySubmission,
	resetCommentError,
	updateComment,
} from './commentsSlice';
import { selectUsers } from '../users/selectors';
import User from '../auth/types/User';
import { loadUsers } from '../users/usersSlice';
import { selectUser } from '../auth/selectors';

interface Props {
	submission: Submission;
}

export default function Comments(props: Props): JSX.Element {
	const { submission } = props;
	const dispatch = useAppDispatch();
	const authUser = useAppSelector(selectUser);
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
	const [editComment, setEditComment] = useState<Comment>({
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

	const handleEditClick = (newId: number): void => {
		setEditComment({ ...editComment, comment_id: newId });
	};

	const handleCancel = (): void => {
		setEditComment({
			comment_id: 0,
			submission_id: submission.submission_id,
			author_id: 0,
			messageText: '',
			messageDate: '',
			archived: false,
		});
		handleEditClick(0);
	};

	const handleSubmitUpdate = useCallback(
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
			const { comment_id, messageText } = editComment;
			if (comment_id < 1) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					idError: 'ID cannot be 0 or negative',
				}));
				hasError = true;
			}
			if (!messageText.trim()) {
				setErrorsObj((prevErrorsObj) => ({
					...prevErrorsObj,
					nameError: 'The text cannot be empty or only spaces',
				}));
				hasError = true;
			}
			if (hasError) {
				return;
			}

			try {
				await dispatch(updateComment(editComment));
				handleEditClick(0);
				setErrorsObj({
					comment_idError: '',
					submission_idError: '',
					author_idError: '',
					messageTextError: '',
					messageDateError: '',
					archivedError: '',
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		},
		[dispatch, errorsObj, editComment]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
		dispatch(resetCommentError());
		const { name: key, value } = e.target;
		setEditComment((prevEditComment) => ({
			...prevEditComment,
			[key]: value,
		}));
	};

	const getAuthor = (findId: number): User | undefined => {
		return users.find((u) => u.id === findId);
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
	}, [dispatch, newComment, editComment]);

	return (
		<>
			<div
				className="list-group"
				style={{ backgroundColor: '#BEBEBE', padding: '10px', marginTop: '20px' }}
			>
				{comments
					.toSorted((a, b) => new Date(a.messageDate).getTime() - new Date(b.messageDate).getTime())
					.map((comment) =>
						authUser?.id === comment.author_id ? (
							editComment.comment_id !== comment.comment_id ? (
								<a
									key={comment.comment_id}
									className="list-group-item list-group-item-action"
									style={{
										display: 'flex',
										flexDirection: 'row',
										gap: '10px',
										justifyContent: 'end',
										backgroundColor: '#fff8f0',
									}}
									aria-current="true"
								>
									<div>
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
									</div>
									<div style={{ display: 'flex', flexDirection: 'column' }}>
										<button
											type="button"
											className="btn btn-outline-dark"
											onClick={() => {
												handleEditClick(comment.comment_id);
												setEditComment(comment);
											}}
										>
											Edit
										</button>
										<button
											type="button"
											className="btn btn-danger"
											onClick={() => dispatch(deleteComment(comment.comment_id))}
										>
											Delete
										</button>
									</div>
								</a>
							) : (
								<>
									<form
										className="auth-form row g-1"
										onSubmit={handleSubmitUpdate}
										style={{ margin: '10px' }}
									>
										<textarea
											className="form-control"
											id="exampleFormControlTextarea1"
											rows={3}
											name="messageText"
											value={editComment.messageText}
											onChange={handleInputChange}
											placeholder={'Comment...'}
										></textarea>
										<button type="submit" className="btn btn-success">
											Save
										</button>
										<button className="btn btn-danger" onClick={handleCancel}>
											Cancel
										</button>
									</form>
								</>
							)
						) : (
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
						)
					)}
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
