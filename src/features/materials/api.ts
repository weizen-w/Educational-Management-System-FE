import Material from './types/Material';

export async function getAll(groupId: number): Promise<Material[]> {
	const result = await fetch(`/api/groups/${groupId}/materials`);
	return result.json();
}
