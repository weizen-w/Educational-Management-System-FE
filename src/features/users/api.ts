import User from '../auth/types/User';
import ErrorResponse from '../error/ErrorResponse';

export async function getAll(): Promise<User[]> {
	const res = await fetch('/api/users');
	return res.json();
}

export async function getUsersByGroup(groupId: number): Promise<User[]> {
	const result = await fetch(`/api/groups/${groupId}/students`);
	return result.json();
}

export async function getUsersByMainGroup(groupId: number): Promise<User[]> {
	const result = await fetch(`/api/groups/${groupId}/users/byMainGroup`);
	return result.json();
}

export async function updateUser(userId: number, user: User): Promise<User> {
	const res = await fetch(`/api/users/${userId}`, {
		method: 'PUT',
		body: JSON.stringify(user),
		headers: {
			'Content-Type': 'application/json',
			accept: 'application/json',
		},
	});
	if (!res.ok) {
		let errTotalMessage = '';
		const errRes: ErrorResponse = await res.json();
		errRes.errors?.map((err) => {
			errTotalMessage += '/' + err.message;
		});
		if (errRes.message) errTotalMessage = errRes.message;
		throw new Error(errTotalMessage);
	}
	return res.json();
}
