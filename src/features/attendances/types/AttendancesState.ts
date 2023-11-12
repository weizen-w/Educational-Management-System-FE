import Attendance from './Attendance';

export default interface AttendancesState {
	attendances: Attendance[];
	error?: string;
}
