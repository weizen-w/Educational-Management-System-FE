export default interface Attendance {
	attendance_id: number;
	student_id: number;
	lesson_id: number;
	attendanceDate: string;
	status: string;
	archived: boolean;
}
