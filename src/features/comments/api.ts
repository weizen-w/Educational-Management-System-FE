import ErrorResponse from '../errors/ErrorResponse';
import Comment from './types/Comment';

export async function getAllBySubmission(submissionId: number): Promise<Comment[]> {
	const res = await fetch(`/api/submissions/${submissionId}/comments`);
	return res.json();
}

export async function createComment(commentText: string, submissionId: number): Promise<Comment> {
	const result = await fetch(`/api/submissions/${submissionId}/comments`, {
		method: 'POST',
		body: JSON.stringify(commentText),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status !== 201) {
		let errTotalMessage = '';
		const errRes: ErrorResponse = await result.json();
		errRes.errors?.map((err) => {
			errTotalMessage += '/' + err.message;
		});
		if (errRes.message) errTotalMessage = errRes.message;
		throw new Error(errTotalMessage);
	}
	return result.json();
}

export async function updateComment(id: number, comment: Comment): Promise<Comment> {
	const result = await fetch(`/api/comments/${id}`, {
		method: 'PUT',
		body: JSON.stringify(comment),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (!result.ok) {
		let errTotalMessage = '';
		const errRes: ErrorResponse = await result.json();
		errRes.errors?.map((err) => {
			errTotalMessage += '/' + err.message;
		});
		if (errRes.message) errTotalMessage = errRes.message;
		throw new Error(errTotalMessage);
	}
	return result.json();
}

export async function deleteComment(commentId: number): Promise<Comment> {
	const result = await fetch(`/api/comments/${commentId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (!result.ok) {
		let errTotalMessage = '';
		const errRes: ErrorResponse = await result.json();
		errRes.errors?.map((err) => {
			errTotalMessage += '/' + err.message;
		});
		if (errRes.message) errTotalMessage = errRes.message;
		throw new Error(errTotalMessage);
	}
	return result.json();
}
