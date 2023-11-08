import { RootState } from '../../app/store';
import Lesson from './types/Lesson';

export const selectLessons = (state: RootState): Lesson[] => state.lessons.lessons;
export const selectLessonError = (state: RootState): string | undefined => state.lessons.error;
