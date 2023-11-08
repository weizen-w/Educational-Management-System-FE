import ErrorResponse from '../errors/ErrorResponse';
import Lesson from './types/Lesson';
import LessonDto from './types/LessonDto';

export async function getAllbyGroup(id: number): Promise<Lesson[]> {
	const result = await fetch(`/api/groups/${id}/lessons/`);
	return result.json();
}

export async function updateLesson(groupId: number, lesson: LessonDto): Promise<Lesson> {
	const result = await fetch(`/api/lesson/${groupId}`, {
		method: 'PUT',
		body: JSON.stringify(lesson),
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

export async function addLesson(groupId: number, lesson: LessonDto): Promise<Lesson> {
	const result = await fetch(`/api/groups/${groupId}/lessons`, {
		method: 'POST',
		body: JSON.stringify(lesson),
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
