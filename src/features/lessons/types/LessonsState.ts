import Lesson from './Lesson';

export default interface LessonsState {
	lessons: Lesson[];
	lesson: Lesson;
	error?: string;
}
