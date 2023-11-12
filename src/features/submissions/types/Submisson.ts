export default interface Submission {
	submission_id: number;
	description: string;
	lesson_id: number;
	student_id: number;
	submission_state: string;
	archived: boolean;
}
