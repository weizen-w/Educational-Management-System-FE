import ErrorResponse from '../errors/ErrorResponse';
import Attendance from './types/Attendance';

export async function getAllByUser(userId: number): Promise<Attendance[]> {
	const res = await fetch(`/api/users/${userId}/attendance`);
	return res.json();
}

export async function updateAttendance(id: number, attendance: Attendance): Promise<Attendance> {
	const result = await fetch(`/api/attendances/${id}`, {
		method: 'PUT',
		body: JSON.stringify(attendance),
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
