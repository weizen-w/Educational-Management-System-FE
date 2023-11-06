import Course from './types/Course';
import { RootState } from '../../app/store';

export const selectCourses = (state: RootState): Course[] => state.courses.courses;
export const selectError = (state: RootState): string | undefined => state.courses.error;
