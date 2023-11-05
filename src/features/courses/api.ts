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
	return result.json();
}
