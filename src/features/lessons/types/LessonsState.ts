import Lesson from './Lesson';

export default interface LessonsState {
	lessons: Lesson[];
	error?: string;
}
