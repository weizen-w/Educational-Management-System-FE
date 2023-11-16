import ErrorResponse from '../errors/ErrorResponse';
import Course from './types/Course';

export async function getAll(): Promise<Course[]> {
	const result = await fetch(`/api/courses/`);
	return result.json();
}

export async function updateCourse(id: number, course: Course): Promise<Course> {
	const result = await fetch(`/api/courses/${id}`, {
		method: 'PUT',
		body: JSON.stringify(course),
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

export async function addCourse(name: string): Promise<Course> {
	const result = await fetch(`/api/courses`, {
		method: 'POST',
		body: JSON.stringify({ name }),
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
