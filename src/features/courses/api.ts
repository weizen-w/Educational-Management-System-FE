import Course from './types/Course';

export async function getAll(): Promise<Course[]> {
	const result = await fetch(`/api/courses/`);
	return result.json();
}
