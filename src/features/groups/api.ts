import Group from './types/Group';

export async function getAll(): Promise<Group[]> {
	const result = await fetch(`/api/groups/`);
	return result.json();
}
