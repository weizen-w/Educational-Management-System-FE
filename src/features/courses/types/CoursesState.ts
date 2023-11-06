import Course from './Course';

export default interface CoursesState {
	courses: Course[];
	error?: string;
}
