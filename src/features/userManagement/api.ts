import User from './types/User';

export async function getAll(): Promise<User[]> {
	const res = await fetch('/api/users');
	return res.json();
}
