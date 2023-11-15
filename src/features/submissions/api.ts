import ErrorResponse from '../errors/ErrorResponse';
import Submission from './types/Submisson';

export async function getAllByUser(userId: number): Promise<Submission[]> {
	const res = await fetch(`/api/users/${userId}/submissions`);
	return res.json();
}

export async function getAllByLesson(lessonId: number): Promise<Submission[]> {
	const res = await fetch(`/api/lesson/${lessonId}/submissions`);
	return res.json();
}

export async function createSubmission(lessonId: number, description: string): Promise<Submission> {
	const result = await fetch(`/api/lesson/${lessonId}/submissions`, {
		method: 'POST',
		body: JSON.stringify(description),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status !== 200) {
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

export async function updateSubmission(id: number, submission: Submission): Promise<Submission> {
	const result = await fetch(`/api/submissions/${id}`, {
		method: 'PUT',
		body: JSON.stringify(submission),
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
