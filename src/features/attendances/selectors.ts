import { RootState } from '../../app/store';
import Attendance from './types/Attendance';

export const selectAttendances = (state: RootState): Attendance[] => state.attendances.attendances;
export const selectAttendanceError = (state: RootState): string | undefined =>
	state.attendances.error;
