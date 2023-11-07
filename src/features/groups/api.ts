import ErrorResponse from '../errors/ErrorResponse';
import Group from './types/Group';

export async function getAll(): Promise<Group[]> {
	const result = await fetch(`/api/groups/`);
	return result.json();
}

export async function updateGroup(id: number, group: Group): Promise<Group> {
	const result = await fetch(`/api/groups/${id}`, {
		method: 'PUT',
		body: JSON.stringify(group),
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

export async function addGroup(group: Group): Promise<Group> {
	const result = await fetch(`/api/groups`, {
		method: 'POST',
		body: JSON.stringify(group),
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
