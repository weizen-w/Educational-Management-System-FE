import User from './types/User';

export async function getAll(): Promise<User[]> {
	const res = await fetch('/api/users');
	return res.json();
}

export async function updateUser(updatedUser: User): Promise<User> {
	const res = await fetch(`/api/users/${updatedUser.id}`, {
		method: 'PUT',
		body: JSON.stringify(updatedUser),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (res.status >= 400) {
		const { message }: { message: string } = await res.json();
		throw new Error(message);
	}

	return res.json();
}
